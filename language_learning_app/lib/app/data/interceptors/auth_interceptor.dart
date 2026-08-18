import 'package:dio/dio.dart';
import 'package:language_learning_app/app/common/values/app_config.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';

final class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._dio, this._tokenStorage)
    : _refreshDio = Dio(
        BaseOptions(
          baseUrl: AppConfig.apiBaseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
          sendTimeout: const Duration(seconds: 15),
          headers: const <String, String>{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ),
      );

  static const String _retriedKey = 'auth_retried';

  static const Set<String> _publicPaths = <String>{
    '/auth/register',
    '/auth/verify-email',
    '/auth/resend-verification-otp',
    '/auth/login',
    '/auth/google',
    '/auth/forgot-password',
    '/auth/verify-reset-otp',
    '/auth/reset-password',
    '/auth/refresh',
  };

  final Dio _dio;
  final Dio _refreshDio;
  final AuthTokenStorage _tokenStorage;

  Future<String>? _refreshFuture;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (!_publicPaths.contains(options.path)) {
      final accessToken = await _tokenStorage.readAccessToken();

      if (accessToken != null && accessToken.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $accessToken';
      }
    }

    handler.next(options);
  }

  @override
  void onError(DioException error, ErrorInterceptorHandler handler) async {
    if (!_shouldTryRefresh(error)) {
      handler.next(error);
      return;
    }

    final requestOptions = error.requestOptions;
    final currentAccessToken = await _tokenStorage.readAccessToken();

    final failedAuthorization = requestOptions.headers['Authorization'];

    // Request này dùng token cũ, nhưng một request khác đã
    // refresh thành công. Chỉ cần thử lại bằng token mới.
    if (currentAccessToken != null &&
        currentAccessToken.isNotEmpty &&
        failedAuthorization != 'Bearer $currentAccessToken') {
      await _retryRequest(
        requestOptions: requestOptions,
        accessToken: currentAccessToken,
        originalError: error,
        handler: handler,
      );
      return;
    }

    try {
      final refreshFuture = _refreshFuture ??= _refreshAccessToken();

      final newAccessToken = await refreshFuture;

      if (identical(_refreshFuture, refreshFuture)) {
        _refreshFuture = null;
      }

      await _retryRequest(
        requestOptions: requestOptions,
        accessToken: newAccessToken,
        originalError: error,
        handler: handler,
      );
    } catch (_) {
      _refreshFuture = null;
      await _tokenStorage.clearTokens();
      handler.next(error);
    }
  }

  bool _shouldTryRefresh(DioException error) {
    final options = error.requestOptions;

    if (error.response?.statusCode != 401 ||
        options.extra[_retriedKey] == true ||
        _publicPaths.contains(options.path)) {
      return false;
    }

    final responseData = error.response?.data;

    if (responseData is Map<String, dynamic>) {
      final errorData = responseData['error'];

      if (errorData is Map<String, dynamic>) {
        final code = errorData['code'] as String?;

        return code == null ||
            code == 'UNAUTHORIZED' ||
            code == 'INVALID_SESSION';
      }
    }

    return true;
  }

  Future<String> _refreshAccessToken() async {
    final refreshToken = await _tokenStorage.readRefreshToken();

    if (refreshToken == null || refreshToken.isEmpty) {
      throw StateError('Không có refresh token');
    }

    final response = await _refreshDio.post<Map<String, dynamic>>(
      '/auth/refresh',
      data: <String, dynamic>{'refreshToken': refreshToken},
    );

    final responseBody = response.data;

    if (responseBody == null) {
      throw StateError('Backend không trả về token mới');
    }

    final tokenData = responseBody['data'] as Map<String, dynamic>;

    final accessToken = tokenData['accessToken'] as String;

    final newRefreshToken = tokenData['refreshToken'] as String;

    await _tokenStorage.saveTokenPair(
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    );

    return accessToken;
  }

  Future<void> _retryRequest({
    required RequestOptions requestOptions,
    required String accessToken,
    required DioException originalError,
    required ErrorInterceptorHandler handler,
  }) async {
    requestOptions.extra[_retriedKey] = true;
    requestOptions.headers['Authorization'] = 'Bearer $accessToken';

    try {
      final response = await _dio.fetch<dynamic>(requestOptions);

      handler.resolve(response);
    } on DioException catch (retryError) {
      handler.next(retryError);
    } catch (_) {
      handler.next(originalError);
    }
  }
}

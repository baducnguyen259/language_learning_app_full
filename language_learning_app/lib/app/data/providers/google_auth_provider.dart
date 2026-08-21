import 'package:dio/dio.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:language_learning_app/app/common/values/app_config.dart';
import 'package:language_learning_app/app/data/models/auth_session_model.dart';

final class GoogleAuthProvider {
  GoogleAuthProvider(this._dio, this._googleSignIn);

  final Dio _dio;
  final GoogleSignIn _googleSignIn;
  bool _isInitialized = false;

  Future<AuthSessionModel> signIn({bool acceptTerms = false}) async {
    await _ensureInitialized();
    final account = await _googleSignIn.authenticate();
    final idToken = account.authentication.idToken;

    if (idToken == null || idToken.isEmpty) {
      throw StateError('Google không trả về ID token.');
    }

    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/google',
      data: <String, dynamic>{'idToken': idToken, 'acceptTerms': acceptTerms},
    );

    final responseBody = response.data;
    if (responseBody == null) {
      throw StateError('Backend không trả về dữ liệu đăng nhập.');
    }

    return AuthSessionModel.fromJson(
      responseBody['data'] as Map<String, dynamic>,
    );
  }

  Future<void> _ensureInitialized() async {
    if (_isInitialized) return;

    final serverClientId = AppConfig.googleServerClientId.trim();
    if (serverClientId.isEmpty) {
      throw StateError(
        'Thiếu GOOGLE_SERVER_CLIENT_ID trong cấu hình chạy ứng dụng.',
      );
    }

    await _googleSignIn.initialize(serverClientId: serverClientId);
    _isInitialized = true;
  }
}

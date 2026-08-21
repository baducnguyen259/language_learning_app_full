import 'package:language_learning_app/app/data/models/auth_session_model.dart';
import 'package:language_learning_app/app/data/models/message_response_model.dart';
import 'package:language_learning_app/app/data/providers/google_auth_provider.dart';
import 'package:language_learning_app/app/data/providers/user_auth_provider.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';

final class UserAuthService {
  final UserAuthProvider _userAuthProvider;
  final GoogleAuthProvider _googleAuthProvider;
  final AuthTokenStorage _tokenStorage;

  const UserAuthService(
    this._userAuthProvider,
    this._googleAuthProvider,
    this._tokenStorage,
  );

  Future<void> _saveSession(AuthSessionModel session) {
    return _tokenStorage.saveTokenPair(
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    );
  }

  Future<MessageResponseModel> register({
    required String email,
    required String password,
    required String confirmPassword,
    required bool acceptTerms,
  }) {
    return _userAuthProvider.register(
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      acceptTerms: acceptTerms,
    );
  }

  Future<AuthSessionModel> verifyEmail({
    required String email,
    required String otp,
  }) async {
    final session = await _userAuthProvider.verifyEmail(email: email, otp: otp);
    await _saveSession(session);
    return session;
  }

  Future<MessageResponseModel> resendVerificationOtp({required String email}) {
    return _userAuthProvider.resendVerificationOtp(email: email);
  }

  Future<AuthSessionModel> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final session = await _userAuthProvider.login(
      email: email,
      password: password,
    );
    await _saveSession(session);
    return session;
  }

  Future<AuthSessionModel> signInWithGoogle({bool acceptTerms = false}) async {
    final session = await _googleAuthProvider.signIn(acceptTerms: acceptTerms);
    await _saveSession(session);
    return session;
  }
}

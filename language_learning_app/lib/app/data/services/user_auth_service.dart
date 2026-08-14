import 'package:language_learning_app/app/data/models/auth_session_model.dart';
import 'package:language_learning_app/app/data/providers/google_auth_provider.dart';
import 'package:language_learning_app/app/data/services/auth_token_storage.dart';

final class UserAuthService {
  const UserAuthService(this._googleAuthProvider, this._tokenStorage);

  final GoogleAuthProvider _googleAuthProvider;
  final AuthTokenStorage _tokenStorage;

  Future<AuthSessionModel> signInWithGoogle() async {
    final session = await _googleAuthProvider.signIn();
    await _tokenStorage.saveAccessToken(session.accessToken);
    return session;
  }
}

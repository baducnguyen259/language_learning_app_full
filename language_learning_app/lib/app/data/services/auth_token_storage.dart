import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final class AuthTokenStorage {
  const AuthTokenStorage({
    FlutterSecureStorage storage = const FlutterSecureStorage(),
  }) : _storage = storage;

  static const String _accessTokenKey = 'access_token';

  final FlutterSecureStorage _storage;

  Future<void> saveAccessToken(String accessToken) {
    return _storage.write(key: _accessTokenKey, value: accessToken);
  }

  Future<String?> readAccessToken() {
    return _storage.read(key: _accessTokenKey);
  }

  Future<void> clearAccessToken() {
    return _storage.delete(key: _accessTokenKey);
  }
}

import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LoginController extends GetxController {
  final emailLoginController = TextEditingController();
  final passwordLoginController = TextEditingController();
  final RxBool isSavePassword = RxBool(false);
}

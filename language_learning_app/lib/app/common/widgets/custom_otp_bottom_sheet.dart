import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/values/values.dart';

/// Bottom sheet nhập mã OTP được gửi tới Gmail của người dùng.
class CustomOtpBottomSheet extends StatefulWidget {
  const CustomOtpBottomSheet({
    super.key,
    required this.controller,
    required this.email,
    required this.onConfirmOtp,
    required this.resendTime,
    this.onResend,
    this.onCountDown,
    this.onFinish,
    this.otpLength = 6,
    this.showLoading = true,
    this.errorMessage,
    this.description,
    this.title = 'Xác nhận email',
  });

  final TextEditingController controller;
  final String email;
  final Future<bool> Function(String otp) onConfirmOtp;
  final RxInt resendTime;
  final VoidCallback? onResend;
  final ValueChanged<int>? onCountDown;
  final VoidCallback? onFinish;
  final int otpLength;
  final bool showLoading;
  final RxString? errorMessage;
  final String? description;
  final String title;

  @override
  State<CustomOtpBottomSheet> createState() => _CustomOtpBottomSheetState();
}

class _CustomOtpBottomSheetState extends State<CustomOtpBottomSheet> {
  late final List<TextEditingController> _digitControllers;
  late final List<FocusNode> _focusNodes;
  late int _secondsRemaining;
  Timer? _timer;
  bool _hasError = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _digitControllers = List.generate(
      widget.otpLength,
      (_) => TextEditingController(),
    );
    _focusNodes = List.generate(widget.otpLength, (_) => FocusNode());
    _secondsRemaining = widget.resendTime.value;
    widget.controller.addListener(_syncDigitsFromController);
    _startCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    widget.controller.removeListener(_syncDigitsFromController);
    for (final controller in _digitControllers) {
      controller.dispose();
    }
    for (final focusNode in _focusNodes) {
      focusNode.dispose();
    }
    super.dispose();
  }

  void _syncDigitsFromController() {
    final otp = widget.controller.text;
    for (var index = 0; index < _digitControllers.length; index++) {
      final digit = index < otp.length ? otp[index] : '';
      if (_digitControllers[index].text == digit) continue;
      _digitControllers[index].value = TextEditingValue(
        text: digit,
        selection: TextSelection.collapsed(offset: digit.length),
      );
    }
  }

  void _startCountdown() {
    _timer?.cancel();
    if (_secondsRemaining <= 0) return;

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() => _secondsRemaining--);
      widget.onCountDown?.call(_secondsRemaining);
      if (_secondsRemaining == 0) {
        _timer?.cancel();
        widget.onFinish?.call();
      }
    });
  }

  void _onDigitChanged(int index, String value) {
    final digit = value.isEmpty ? '' : value[value.length - 1];
    if (_digitControllers[index].text != digit) {
      _digitControllers[index].value = TextEditingValue(
        text: digit,
        selection: TextSelection.collapsed(offset: digit.length),
      );
    }

    final otp = _digitControllers.map((item) => item.text).join();
    widget.controller.value = TextEditingValue(
      text: otp,
      selection: TextSelection.collapsed(offset: otp.length),
    );

    if (_hasError) setState(() => _hasError = false);
    if (digit.isNotEmpty && index < _focusNodes.length - 1) {
      _focusNodes[index + 1].requestFocus();
    }
    if (otp.length == widget.otpLength) _confirmOtp(otp);
  }

  KeyEventResult _handleKeyEvent(int index, KeyEvent event) {
    if (event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.backspace &&
        _digitControllers[index].text.isEmpty &&
        index > 0) {
      _digitControllers[index - 1].clear();
      _focusNodes[index - 1].requestFocus();
      _onDigitChanged(index - 1, '');
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  Future<void> _confirmOtp(String otp) async {
    if (_isSubmitting) return;
    setState(() => _isSubmitting = true);

    final isValid = await widget.onConfirmOtp(otp);
    if (!mounted) return;

    setState(() {
      _isSubmitting = false;
      _hasError = !isValid;
    });
    if (isValid) Get.back(result: true);
  }

  void _resendOtp() {
    if (_secondsRemaining > 0 || widget.onResend == null) return;
    widget.onResend!();
    setState(() {
      _secondsRemaining = widget.resendTime.value > 0
          ? widget.resendTime.value
          : 60;
    });
    _startCountdown();
  }

  String get _description {
    if (widget.description?.isNotEmpty == true) return widget.description!;
    return 'Nhập mã OTP đã được gửi đến Gmail\n${widget.email}';
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return SizedBox.expand(
      child: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(16, 8, 16, bottomInset + 24),
          child: Column(
            children: [
            _buildHandle(),
            const SizedBox(height: 20),
            _buildHeader(),
            const SizedBox(height: 12),
            Text(
              _description,
              textAlign: TextAlign.center,
              style: AppTextStyle.bodySReg.copyWith(
                color: AppColors.colorTextT02,
              ),
            ),
            const SizedBox(height: 28),
            _buildOtpFields(),
            SizedBox(
              height: 40,
              child: _hasError
                  ? Center(
                      child: Text(
                        widget.errorMessage?.value ?? 'Mã OTP không chính xác.',
                        style: AppTextStyle.bodyXSReg.copyWith(
                          color: AppColors.colorAccentRed07,
                        ),
                      ),
                    )
                  : null,
            ),
            TextButton(
              onPressed: _secondsRemaining == 0 ? _resendOtp : null,
              child: Text(
                _secondsRemaining == 0
                    ? 'Gửi lại mã OTP'
                    : 'Gửi lại sau ${_secondsRemaining}s',
                style: AppTextStyle.labelMedSmall.copyWith(
                  color: _secondsRemaining == 0
                      ? AppColors.contentPurple
                      : AppColors.contentBlue,
                ),
              ),
            ),
            if (_isSubmitting && widget.showLoading)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: CircularProgressIndicator(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHandle() {
    return Container(
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: AppColors.borderPrimaryBoldGrayScaleP,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        IconButton(
          tooltip: 'Quay lại',
          onPressed: Get.back,
          icon: const Icon(Icons.arrow_back),
        ),
        Expanded(
          child: Text(
            widget.title,
            textAlign: TextAlign.center,
            style: AppTextStyle.headingH6Semi,
          ),
        ),
        const SizedBox(width: 48),
      ],
    );
  }

  Widget _buildOtpFields() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(widget.otpLength, _buildOtpField),
    );
  }

  Widget _buildOtpField(int index) {
    final borderColor = _hasError
        ? AppColors.colorAccentRed06
        : AppColors.borderOpaque;

    return SizedBox(
      width: 44,
      height: 52,
      child: Focus(
        onKeyEvent: (_, event) => _handleKeyEvent(index, event),
        child: TextField(
          controller: _digitControllers[index],
          focusNode: _focusNodes[index],
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          maxLength: 1,
          enabled: !_isSubmitting,
          onChanged: (value) => _onDigitChanged(index, value),
          style: AppTextStyle.headingH6Semi,
          decoration: InputDecoration(
            counterText: '',
            contentPadding: EdgeInsets.zero,
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: AppColors.contentPurple, width: 2),
            ),
          ),
        ),
      ),
    );
  }
}

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';

/// Hiển thị thời gian chờ và cho phép gửi lại mã OTP.
class CustomResendOtpWidget extends StatefulWidget {
  const CustomResendOtpWidget({
    super.key,
    this.initialValue = 90,
    required this.onCountDown,
    this.onFinish,
    this.onResend,
  });

  final int initialValue;
  final ValueChanged<int> onCountDown;
  final VoidCallback? onFinish;
  final FutureOr<void> Function()? onResend;

  @override
  State<CustomResendOtpWidget> createState() => _CustomResendOtpWidgetState();
}

class _CustomResendOtpWidgetState extends State<CustomResendOtpWidget>
    with WidgetsBindingObserver {
  Timer? _timer;
  late int _secondsRemaining;
  DateTime? _pausedAt;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _secondsRemaining = _validInitialValue;
    _startTimer();
  }

  @override
  void didUpdateWidget(covariant CustomResendOtpWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialValue != widget.initialValue) {
      _secondsRemaining = _validInitialValue;
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  int get _validInitialValue => widget.initialValue < 0 ? 0 : widget.initialValue;

  void _startTimer() {
    _timer?.cancel();
    if (_secondsRemaining == 0) return;

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      if (_secondsRemaining <= 1) {
        setState(() => _secondsRemaining = 0);
        _timer?.cancel();
        widget.onCountDown(0);
        widget.onFinish?.call();
        return;
      }

      setState(() => _secondsRemaining--);
      widget.onCountDown(_secondsRemaining);
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive ||
        state == AppLifecycleState.hidden) {
      _pausedAt ??= DateTime.now();
      return;
    }

    if (state != AppLifecycleState.resumed || _pausedAt == null) return;

    final elapsedSeconds = DateTime.now().difference(_pausedAt!).inSeconds;
    _pausedAt = null;
    if (elapsedSeconds <= 0 || _secondsRemaining == 0) return;

    final updatedValue = (_secondsRemaining - elapsedSeconds)
        .clamp(0, _secondsRemaining)
        .toInt();
    setState(() => _secondsRemaining = updatedValue);
    widget.onCountDown(_secondsRemaining);
    if (_secondsRemaining == 0) {
      _timer?.cancel();
      widget.onFinish?.call();
    } else {
      _startTimer();
    }
  }

  Future<void> _resend() async {
    if (_secondsRemaining != 0 || widget.onResend == null) return;
    await widget.onResend!();
    if (!mounted) return;
    setState(() => _secondsRemaining = _validInitialValue);
    _startTimer();
  }

  String _formatDuration(int totalSeconds) {
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final canResend = _secondsRemaining == 0 && widget.onResend != null;
    return Semantics(
      button: canResend,
      enabled: canResend,
      label: canResend ? 'Gửi lại mã OTP' : 'Đang chờ gửi lại mã OTP',
      child: InkWell(
        onTap: canResend ? _resend : null,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Text(
            canResend
                ? 'Gửi lại mã OTP'
                : 'Gửi lại OTP sau: ${_formatDuration(_secondsRemaining)}',
            style: (_secondsRemaining == 0
                    ? AppTextStyle.labelSmall
                    : AppTextStyle.paragraphSmall)
                .copyWith(
                  color: _secondsRemaining == 0
                      ? AppColors.contentPPInfo
                      : AppColors.contentTertiary,
                ),
          ),
        ),
      ),
    );
  }
}

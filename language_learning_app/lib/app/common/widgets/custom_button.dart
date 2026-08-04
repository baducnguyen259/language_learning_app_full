import 'dart:async';

import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';

enum ButtonSizeEnum { LARGE, MEDIUM, SMALL, EXTRA_SMALL }

extension ButtonSizeExtension on ButtonSizeEnum {
  double get height {
    switch (this) {
      case ButtonSizeEnum.LARGE:
        return 48;
      case ButtonSizeEnum.MEDIUM:
        return 40;
      case ButtonSizeEnum.SMALL:
        return 36;
      case ButtonSizeEnum.EXTRA_SMALL:
        return 32;
    }
  }
}

/// Controller dùng để kích hoạt nút từ bên ngoài.
class ButtonController extends ChangeNotifier {
  void onPressed() => notifyListeners();
}

abstract class BaseButton extends StatefulWidget {
  const BaseButton({
    super.key,
    required this.child,
    this.backgroundColor,
    this.foregroundColor,
    this.disableForegroundColor,
    this.disableBackgroundColor,
    this.borderColor,
    this.onPressed,
    this.showLoading = false,
    this.showBorder = false,
    this.width,
    this.radius = 100,
    this.borderWidth = 1,
    this.padding,
    this.buttonSize = ButtonSizeEnum.LARGE,
    this.controller,
  });

  final Widget child;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? disableForegroundColor;
  final Color? disableBackgroundColor;
  final Color? borderColor;
  final FutureOr<void> Function()? onPressed;
  final bool showLoading;
  final bool showBorder;
  final double? width;
  final double? radius;
  final double? borderWidth;
  final EdgeInsetsGeometry? padding;
  final ButtonSizeEnum buttonSize;
  final ButtonController? controller;

  @override
  State<BaseButton> createState() => _BaseButtonState();
}

class _BaseButtonState extends State<BaseButton> {
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    widget.controller?.addListener(_handleControllerPressed);
  }

  @override
  void didUpdateWidget(covariant BaseButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller?.removeListener(_handleControllerPressed);
      widget.controller?.addListener(_handleControllerPressed);
    }
  }

  @override
  void dispose() {
    widget.controller?.removeListener(_handleControllerPressed);
    super.dispose();
  }

  void _handleControllerPressed() {
    if (widget.onPressed != null) _handlePressed();
  }

  Future<void> _handlePressed() async {
    if (_isLoading || widget.onPressed == null) return;

    if (widget.showLoading) {
      setState(() => _isLoading = true);
    }
    try {
      await widget.onPressed!();
    } finally {
      if (mounted && widget.showLoading) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isEnabled = widget.onPressed != null;
    final foregroundColor = widget.foregroundColor ?? colorScheme.onPrimary;
    final backgroundColor = widget.backgroundColor ?? colorScheme.primary;
    final disabledForegroundColor =
        widget.disableForegroundColor ?? colorScheme.onSurfaceVariant;
    final disabledBackgroundColor =
        widget.disableBackgroundColor ?? colorScheme.surfaceContainerHighest;

    return IgnorePointer(
      ignoring: _isLoading,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final width =
              widget.width ??
              (constraints.hasBoundedWidth ? double.infinity : null);

          return SizedBox(
            width: width,
            height: widget.buttonSize.height,
            child: TextButton(
              onPressed: isEnabled ? _handlePressed : null,
              style: TextButton.styleFrom(
                padding: widget.padding,
                backgroundColor: backgroundColor,
                foregroundColor: foregroundColor,
                disabledBackgroundColor: disabledBackgroundColor,
                disabledForegroundColor: disabledForegroundColor,
                side: widget.showBorder
                    ? BorderSide(
                        color: widget.borderColor ?? foregroundColor,
                        width: widget.borderWidth ?? 1,
                      )
                    : BorderSide.none,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(widget.radius ?? 100),
                ),
              ),
              child: _isLoading
                  ? SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: isEnabled
                            ? foregroundColor
                            : disabledForegroundColor,
                      ),
                    )
                  : widget.child,
            ),
          );
        },
      ),
    );
  }
}

class CustomButton extends BaseButton {
  const CustomButton({
    super.key,
    required super.child,
    super.backgroundColor,
    super.foregroundColor,
    super.disableForegroundColor,
    super.disableBackgroundColor,
    super.borderColor,
    super.onPressed,
    super.showLoading,
    super.showBorder,
    super.width,
    super.radius,
    super.borderWidth,
    super.padding,
    super.buttonSize,
    super.controller,
  });

  CustomButton.text({
    super.key,
    required String title,
    TextStyle? style,
    super.backgroundColor,
    super.foregroundColor,
    super.disableForegroundColor,
    super.disableBackgroundColor,
    super.onPressed,
    super.width,
    super.radius,
    super.padding,
    super.showLoading,
    super.buttonSize,
    super.controller,
  }) : super(child: Text(title, style: style ?? AppTextStyle.buttonL));

  CustomButton.outline({
    super.key,
    required String title,
    TextStyle? style,
    super.backgroundColor = Colors.white,
    super.foregroundColor,
    super.borderColor = Colors.black,
    super.onPressed,
    super.width,
    super.radius,
    super.borderWidth,
    super.padding,
    super.showLoading,
    super.buttonSize,
    super.controller,
  }) : super(
         showBorder: true,
         child: Text(title, style: style ?? AppTextStyle.buttonL),
       );

  CustomButton.primary({
    super.key,
    required String title,
    TextStyle? style,
    super.onPressed,
    super.width,
    super.padding,
    super.showLoading,
    super.buttonSize,
    super.controller,
    super.backgroundColor,
    double radius = 100,
  }) : super(
         foregroundColor: Colors.white,
         child: Text(title, style: style ?? AppTextStyle.buttonL),
         radius: radius,
       );
}

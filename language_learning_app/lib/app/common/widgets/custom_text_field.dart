import 'dart:ui' show SemanticsValidationResult;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:language_learning_app/app/common/values/values.dart';

/// Trường văn bản Material 3 với nhãn, trạng thái kiểm tra hợp lệ và văn bản trợ giúp.
///
/// Nơi gọi sở hữu [controller] và [focusNode] tùy chọn, đồng thời phải dispose
/// chúng. Lỗi bắt buộc và lỗi validator hiển thị sau khi người dùng tương tác;
/// [errorText] bên ngoài không rỗng sẽ hiển thị ngay lập tức.
///
/// Ví dụ:
/// ```dart
/// CustomTextField(
///   controller: emailController,
///   labelInput: 'Email',
///   semanticLabel: 'Địa chỉ email',
///   keyboardType: TextInputType.emailAddress,
///   isRequired: true,
///   validate: (value) => value.contains('@'),
/// );
/// ```
class CustomTextField extends StatefulWidget {
  /// Tạo trường văn bản được điều khiển bởi [controller].
  const CustomTextField({
    super.key,
    required this.controller,
    this.labelInput,
    this.focusNode,
    this.hintText = '',
    this.infoText,
    this.errorText,
    this.validate,
    this.isRequired = false,
    this.keyboardType,
    this.textInputAction,
    this.suffixWidget,
    this.prefixWidget,
    this.maxLength,
    this.actionFunction,
    this.contentPadding,
    this.readOnly = false,
    this.showBorder = true,
    this.onChanged,
    this.onSubmitted,
    this.radius = 14,
    this.fillColor,
    this.focusedBorderColor,
    this.enabledBorderColor,
    this.inputFormatters,
    this.labelStyle,
    this.hintStyle,
    this.style,
    this.onClearText,
    this.focusBorderWidth = 1,
    this.height,
    this.autoFocus = false,
    this.showErrorText = true,
    this.obscureText = false,
    this.minLines = 1,
    this.maxLines = 1,
    this.semanticLabel,
  }) : assert(
         validate == null || suffixWidget == null,
         'Không thể sử dụng đồng thời validate và suffixWidget.',
       ),
       assert(radius >= 0, 'radius phải lớn hơn hoặc bằng 0.'),
       assert(
         focusBorderWidth >= 0,
         'focusBorderWidth phải lớn hơn hoặc bằng 0.',
       ),
       assert(minLines > 0, 'minLines phải lớn hơn 0.'),
       assert(
         maxLines >= minLines,
         'maxLines phải lớn hơn hoặc bằng minLines.',
       ),
       assert(
         !obscureText || maxLines == 1,
         'Trường nhập mật khẩu chỉ được sử dụng một dòng.',
       );

  final String? labelInput;
  final TextStyle? labelStyle;
  final TextStyle? hintStyle;
  final TextStyle? style;
  final bool isRequired;
  final bool readOnly;
  final bool showBorder;
  final double focusBorderWidth;
  final TextEditingController controller;
  final FocusNode? focusNode;
  final String? hintText;
  final String? infoText;
  final String? errorText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Widget? suffixWidget;
  final Widget? prefixWidget;
  final int? maxLength;
  final bool Function(String value)? validate;
  final VoidCallback? actionFunction;
  final ValueChanged<String>? onSubmitted;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClearText;
  final EdgeInsetsGeometry? contentPadding;
  final double radius;
  final Color? fillColor;
  final Color? enabledBorderColor;
  final Color? focusedBorderColor;
  final List<TextInputFormatter>? inputFormatters;
  final double? height;
  final bool autoFocus;
  final bool showErrorText;
  final int minLines;
  final int maxLines;
  final bool obscureText;

  /// Nhãn hỗ trợ tiếp cận gắn với trường có thể chỉnh sửa.
  ///
  /// Mặc định là [labelInput] nếu bị bỏ qua.
  final String? semanticLabel;

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool? _isValid;
  bool _isTouched = false;
  late String _lastText;

  bool get _hasExternalError => widget.errorText?.isNotEmpty ?? false;

  bool get _hasVisibleError =>
      _hasExternalError || (_isTouched && _isValid == false);

  @override
  void initState() {
    super.initState();
    _lastText = widget.controller.text;
    _isValid = _resolveValidation(_lastText);
    widget.controller.addListener(_handleControllerChanged);
  }

  @override
  void didUpdateWidget(covariant CustomTextField oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.removeListener(_handleControllerChanged);
      widget.controller.addListener(_handleControllerChanged);
      _lastText = widget.controller.text;
      _isTouched = false;
    }

    if (oldWidget.controller != widget.controller ||
        oldWidget.errorText != widget.errorText ||
        oldWidget.validate != widget.validate ||
        oldWidget.isRequired != widget.isRequired) {
      _isValid = _resolveValidation(widget.controller.text);
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_handleControllerChanged);
    super.dispose();
  }

  bool? _resolveValidation(String value) {
    if (_hasExternalError) return false;

    if (value.trim().isEmpty) return widget.isRequired ? false : null;

    final validate = widget.validate;
    if (validate != null) return validate(value);

    return widget.isRequired ? true : null;
  }

  void _handleControllerChanged() {
    final value = widget.controller.text;
    if (_lastText == value) return;

    _lastText = value;
    final validation = _resolveValidation(value);
    if (mounted) {
      setState(() => _isValid = validation);
    }
  }

  void _handleChanged(String value) {
    final validation = _resolveValidation(value);
    if (!_isTouched || _isValid != validation) {
      setState(() {
        _isTouched = true;
        _isValid = validation;
      });
    }

    widget.onChanged?.call(value);
  }

  void _handleSubmitted(String value) {
    if (!_isTouched) setState(() => _isTouched = true);
    widget.onSubmitted?.call(value);
  }

  void _clearText() {
    final onChanged = widget.onChanged;
    final onClearText = widget.onClearText;

    _isTouched = true;
    widget.controller.clear();
    onChanged?.call('');
    onClearText?.call();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final borderRadius = BorderRadius.circular(widget.radius);
    final errorColor = colorScheme.error;
    final hasVisibleError = _hasVisibleError;
    final effectiveTextInputAction =
        widget.textInputAction ??
        (widget.maxLines > 1 ? TextInputAction.newline : TextInputAction.done);

    final enabledBorder = OutlineInputBorder(
      borderRadius: borderRadius,
      borderSide: widget.showBorder
          ? BorderSide(
              width: hasVisibleError ? 2 : 1,
              color: hasVisibleError
                  ? errorColor
                  : widget.enabledBorderColor ?? colorScheme.outlineVariant,
            )
          : BorderSide.none,
    );

    final focusedBorder = OutlineInputBorder(
      borderRadius: borderRadius,
      borderSide: widget.showBorder
          ? BorderSide(
              width: hasVisibleError ? 2 : widget.focusBorderWidth,
              color: hasVisibleError
                  ? errorColor
                  : widget.focusedBorderColor ?? AppColors.contentBlack,
            )
          : BorderSide.none,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.labelInput?.isNotEmpty ?? false)
          Padding(
            padding: const EdgeInsets.only(bottom: 2),
            child: Row(
              children: [
                Flexible(
                  child: ExcludeSemantics(
                    child: Text(
                      widget.labelInput!,
                      style:
                          widget.labelStyle ??
                          theme.textTheme.labelMedium?.copyWith(
                            color: colorScheme.onSurface,
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                    ),
                  ),
                ),
                if (widget.isRequired)
                  ExcludeSemantics(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: Text(
                        '*',
                        style: TextStyle(
                          color: errorColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        SizedBox(
          height: widget.height,
          child: Semantics(
            label: widget.semanticLabel ?? widget.labelInput,
            isRequired: widget.isRequired,
            validationResult: hasVisibleError
                ? SemanticsValidationResult.invalid
                : _isTouched && _isValid == true
                ? SemanticsValidationResult.valid
                : SemanticsValidationResult.none,
            child: TextField(
              controller: widget.controller,
              focusNode: widget.focusNode,
              autofocus: widget.autoFocus,
              readOnly: widget.readOnly,
              obscureText: widget.obscureText,
              keyboardType: widget.keyboardType,
              textInputAction: effectiveTextInputAction,
              inputFormatters: widget.inputFormatters,
              maxLength: widget.maxLength,
              minLines: widget.minLines,
              maxLines: widget.maxLines,
              cursorColor: colorScheme.primary,
              style:
                  widget.style ??
                  theme.textTheme.bodyLarge?.copyWith(
                    color: colorScheme.onSurface,
                    height: 1,
                    fontSize: 12,
                  ),
              onTap: widget.actionFunction,
              onChanged: _handleChanged,
              onSubmitted: _handleSubmitted,
              decoration: InputDecoration(
                hintText: widget.hintText,
                hintStyle:
                    widget.hintStyle ??
                    theme.textTheme.bodyLarge?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                      fontSize: 12,
                    ),
                contentPadding:
                    widget.contentPadding ??
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                filled: true,
                fillColor: widget.fillColor ?? Colors.white,
                border: enabledBorder,
                enabledBorder: enabledBorder,
                focusedBorder: focusedBorder,
                counterText: '',
                prefixIcon: widget.prefixWidget == null
                    ? null
                    : Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: widget.prefixWidget,
                      ),
                prefixIconConstraints: const BoxConstraints(minWidth: 48),
                suffixIcon:
                    widget.suffixWidget ??
                    _buildStatusIcon(
                      colorScheme,
                      hasVisibleError: hasVisibleError,
                    ),
              ),
            ),
          ),
        ),
        if (widget.showErrorText && hasVisibleError && _hasExternalError)
          Semantics(
            container: true,
            liveRegion: true,
            label: widget.errorText,
            child: ExcludeSemantics(
              child: Padding(
                padding: const EdgeInsets.only(left: 4, top: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.error, color: errorColor, size: 14),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        widget.errorText!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: errorColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        if (widget.infoText?.isNotEmpty ?? false)
          Padding(
            padding: const EdgeInsets.only(left: 4, top: 8),
            child: Text(
              widget.infoText!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ),
      ],
    );
  }

  Widget? _buildStatusIcon(
    ColorScheme colorScheme, {
    required bool hasVisibleError,
  }) {
    if (widget.controller.text.isEmpty) return null;

    if (_isValid == true) {
      return Icon(
        Icons.check_circle,
        key: const ValueKey('valid'),
        color: colorScheme.primary,
      );
    }

    if (widget.readOnly) return null;

    final isInvalid = hasVisibleError;
    return IconButton(
      key: ValueKey(isInvalid ? 'invalid' : 'clear'),
      tooltip: 'Xóa nội dung',
      onPressed: _clearText,
      icon: Icon(
        isInvalid ? Icons.cancel : Icons.clear,
        color: isInvalid ? colorScheme.error : colorScheme.onSurfaceVariant,
      ),
    );
  }
}

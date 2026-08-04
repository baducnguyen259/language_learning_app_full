import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Checkbox theo theme với vùng tương tác có kích thước theo Material.
///
/// [boxSize] chỉ điều khiển kích thước ô hiển thị. Vùng chạm vẫn tối thiểu
/// 48 pixel logic để hỗ trợ khả năng tiếp cận.
///
/// Ví dụ:
/// ```dart
/// CustomCheckbox(
///   initValue: selected,
///   semanticLabel: 'Ghi nhớ lựa chọn',
///   onChanged: (value) => setState(() => selected = value!),
/// );
/// ```
class CustomCheckbox extends StatefulWidget {
  /// Tạo checkbox với giá trị ban đầu là [initValue].
  const CustomCheckbox({
    super.key,
    required this.initValue,
    required this.onChanged,
    this.boxSize = 24,
    this.tickSize = 16,
    this.boxColor,
    this.tickColor,
    this.borderRadius = 6,
    this.gradient,
    this.borderColor,
    this.checkedColor,
    this.semanticLabel,
  }) : assert(boxSize > 0, 'boxSize phải lớn hơn 0.'),
       assert(tickSize >= 0, 'tickSize phải lớn hơn hoặc bằng 0.'),
       assert(borderRadius >= 0, 'borderRadius phải lớn hơn hoặc bằng 0.');

  final bool initValue;
  final ValueChanged<bool?>? onChanged;
  final double boxSize;
  final double tickSize;
  final Color? boxColor;
  final Color? tickColor;
  final double borderRadius;
  final Gradient? gradient;
  final Color? borderColor;
  final Color? checkedColor;

  /// Nhãn hỗ trợ tiếp cận mô tả chức năng của checkbox này.
  final String? semanticLabel;

  @override
  State<CustomCheckbox> createState() => _CustomCheckboxState();
}

class _CustomCheckboxState extends State<CustomCheckbox> {
  late bool _value;

  @override
  void initState() {
    super.initState();
    _value = widget.initValue;
  }

  @override
  void didUpdateWidget(covariant CustomCheckbox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initValue != widget.initValue) {
      _value = widget.initValue;
    }
  }

  void _toggle() {
    final onChanged = widget.onChanged;
    if (onChanged == null) return;

    final nextValue = !_value;
    setState(() => _value = nextValue);
    onChanged(nextValue);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final boxColor = widget.boxColor ?? colorScheme.primary;
    final checkedColor = widget.checkedColor ?? boxColor;
    final borderColor = widget.borderColor ?? boxColor;
    final tickColor = widget.tickColor ?? colorScheme.onPrimary;
    final innerRadius = math.max(0.0, widget.borderRadius - 2);
    final enabled = widget.onChanged != null;
    final tapTargetSize = math.max(kMinInteractiveDimension, widget.boxSize);

    return Semantics(
      label: widget.semanticLabel,
      checked: _value,
      enabled: enabled,
      onTap: enabled ? _toggle : null,
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: tapTargetSize,
          child: Opacity(
            opacity: enabled ? 1 : 0.38,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: enabled ? _toggle : null,
                borderRadius: BorderRadius.circular(
                  math.max(widget.borderRadius, 12),
                ),
                child: Center(
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    curve: Curves.easeOut,
                    width: widget.boxSize,
                    height: widget.boxSize,
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: _value || widget.gradient == null
                          ? (_value ? checkedColor : borderColor)
                          : null,
                      gradient: _value ? null : widget.gradient,
                      borderRadius: BorderRadius.circular(widget.borderRadius),
                    ),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      decoration: BoxDecoration(
                        color: _value ? checkedColor : colorScheme.surface,
                        borderRadius: BorderRadius.circular(innerRadius),
                      ),
                      child: AnimatedScale(
                        duration: const Duration(milliseconds: 150),
                        curve: Curves.easeOutBack,
                        scale: _value ? 1 : 0,
                        child: Icon(
                          Icons.check_rounded,
                          size: widget.tickSize,
                          color: tickColor,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

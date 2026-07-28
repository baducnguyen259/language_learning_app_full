## Project Overview

This project is a Flutter mobile application.

Tech stack:

* Flutter
* Dart
* GetX
* Material 3

Always follow the existing project architecture and coding style.

---

## Existing Code First

Before generating any code:

1. Search existing modules.
2. Search existing widgets.
3. Search existing controllers.
4. Search existing bindings.
5. Search existing routes.

Priority:

Reuse existing code > Extend existing code > Create new code

Never create duplicate widgets if a similar widget already exists.

---

## Architecture

Use GetX architecture.

Structure:

lib/
├── app/
│   ├── modules/
│   ├── data/
│   └── core/
│
├── routes/
│
└── utils/

For every new screen create:

* views
* controllers
* bindings
* widgets

Example:

home/
├── views/
│   └── home_view.dart
├── controllers/
│   └── home_controller.dart
├── bindings/
│   └── home_binding.dart
└── widgets/
└── home_widget.dart

---

## Design System

Always use existing design system files.

Theme files:

* lib/app/core/values/app_colors.dart
* lib/app/core/values/app_text_styles.dart
* lib/app/core/values/app_icons.dart
* lib/app/core/values/app_images.dart

Never create:

* New colors
* New typography styles
* New icon values
* New image values

Reuse existing design tokens.

---

## Colors

Always use:

AppColors.xxx

Bad:

Color(0xFFFFFFFF)
Colors.white

Good:

AppColors.white

---

## Typography

Always use:

AppTextStyles.xxx

Bad:

TextStyle(
fontSize: 14,
fontWeight: FontWeight.w500,
)

Good:

AppTextStyles.bodyMedium

---

## Icon

Always use:

AppIcons.xxx

Bad:

Icons.arrow_back

Good:

AppIcons.arrowBack

---

## Image

Always use:

AppImages.xxx

Bad:

'assets/images/banner.png'

Good:

AppImages.banner

---

## Scaffold

Always use:

BaseScaffold

Do not use:

Scaffold

unless BaseScaffold is incompatible.

---


## Image Rendering

Always use:

CustomImage

Do not use:

* Image.asset
* Image.network
* Image.file

unless specifically requested.

---

## HTML Rendering

Always use:

CustomHtmlText

for HTML content.

---

## Reusable Widgets

Always reuse existing widgets when available.

Current reusable widgets:

* BaseScaffold
* CustomHtmlText
* CustomImage

Before creating a new widget:

1. Search existing widgets.
2. Reuse existing widget if possible.
3. Extend existing widget if necessary.

Only create a new widget if no suitable widget exists.

---

## State Management

Use GetX only.

Rules:

* Controller extends GetxController
* Binding extends Bindings
* Use Rx types when appropriate
* Prefer Obx
* Avoid StatefulWidget unless necessary

Example:

final RxInt count = RxInt(0);

---

## Screen States

Every API screen should support:

* Loading
* Empty
* Error
* Success

Use existing widgets if available.

Never leave loading state unimplemented.

---

## Responsive

Support:

* Mobile
* Tablet

Avoid hardcoded screen dimensions.

Prefer:

* MediaQuery
* LayoutBuilder
* Existing responsive utilities

---

## Navigation

Use GetX navigation only.

Examples:

Get.to(...)
Get.off(...)
Get.offAll(...)
Get.until(...)

Do not use:

Navigator.push
Navigator.pop

unless specifically requested.

---

## Route Generation

When creating a new page:

Always update:

* lib/routes_routes.dart
* lib/routes/app_pages.dart

Example:

static const HOME = '/home';

Never skip route registration.

---

## Figma Conversion

When implementing from Figma:

1. Match layout closely.
2. Match spacing closely.
3. Match typography closely.
4. Match border radius closely.
5. Use existing design system.
6. Use existing reusable widgets.
7. Reuse existing design tokens.

Never generate:

* Color(...)
* TextStyle(...)
* FontWeight.wXXX
* Inline styles

if equivalent tokens already exist.

If a design token is missing:

Mention it instead of creating random values.

---

## Code Style

Requirements:

* Null Safety
* Clean Code
* Reusable Widgets
* Small Methods
* Meaningful Variable Names

Avoid:

* Huge build methods
* Duplicate UI code
* Deep widget nesting

Extract widgets when needed.

---

## New Screen Checklist

Every new screen must:

✓ Create controller

✓ Create binding

✓ Create view

✓ Create widget folder

✓ Register route

✓ Use BaseScaffold

✓ Use CustomImage

✓ Use AppColors

✓ Use AppTextStyles

✓ Support responsive layout

---

## Output Requirements

When generating a new screen:

Generate:

1. lib/app/modules/{page}/controllers
2. lib/app/modules/{page}/bindings
3. lib/app/modules/{page}/views
4. lib/app/modules/{page}/widgets
5. lib/routes/app_pages.dart
6. lib/routes/app_routes.dart

When generating UI:

* Full Flutter code
* Create route and page registration
* Ready to compile
* No pseudocode
* No TODO comments
* Production-ready code

---

# Custom Commands

## create-screen

When user says:

create-screen <figma-link>

Automatically:

1. Read AGENTS.md

2. Analyze Figma node

3. Search similar modules

4. Search reusable widgets

5. Search existing routes

6. Reuse existing design tokens

7. Generate:

   * Controller
   * Binding
   * View
   * Widgets
   * Route registration

8. Return production-ready code

---

## figma-to-flutter

When user provides:

* Figma link
* Figma node

Automatically:

* Analyze design
* Convert to Flutter
* Follow Design System
* Follow Route Rules
* Generate production-ready code

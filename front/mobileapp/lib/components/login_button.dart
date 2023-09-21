import 'package:flutter/material.dart';

class LoginButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String label;

  const LoginButton({required this.onPressed, this.label = 'Login', Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: const Color(0xFF1D1D1D), backgroundColor: Colors.white,
        elevation: 0,
        fixedSize: const Size(316, 63),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      child: Text(
        label,
        textAlign: TextAlign.right,
        style: const TextStyle(
          fontFamily: 'Archivo',
          fontSize: 30,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

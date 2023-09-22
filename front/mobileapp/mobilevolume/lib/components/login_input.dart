import 'package:flutter/material.dart';

class LoginInput extends StatelessWidget {
  final String hint;
  final bool obscureText;

  const LoginInput({
    required this.hint,
    this.obscureText = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 316,
      height: 63,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        obscureText: obscureText,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(
            color: Color(0xFFA4A9AE),
            fontFamily: 'Archivo',
            fontSize: 16,
            fontWeight: FontWeight.w400,
            height: 23.44 / 16,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFF1D1D1D),
      body: Center(
        child: Text('Welcome to the Account Screen!'),
      ),
    );
  }
}
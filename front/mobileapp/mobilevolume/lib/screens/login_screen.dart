import 'package:flutter/material.dart';
import 'home_screen.dart';
import '../components/login_button.dart';
import '../components/login_input.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const SizedBox(height: 80),
            Center(
              child: Image.asset('assets/logo_ifttt.png'),
            ),
            const SizedBox(height: 150),
            Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    const Align(
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: EdgeInsets.only(left: 20.0),
        child: Text(
          "Login",
          style: TextStyle(
            fontFamily: 'Archivo',
            fontSize: 45,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
    ),
    const SizedBox(height: 20),
    const LoginInput(
      hint: "Username",
    ),
                const SizedBox(height: 20),
                const LoginInput(
                  hint: "Password",
                  obscureText: true,
                ),
                const SizedBox(height: 70),
                Padding(
                  padding: const EdgeInsets.only(top: 24),
                  child: LoginButton(onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const HomeScreen()),
                    );
                  }),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

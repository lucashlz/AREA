import 'package:flutter/material.dart';
import 'package:mobileapp/screens/login_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../components/my_input.dart';
import '../components/my_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  RegisterScreenState createState() => RegisterScreenState();
}

class RegisterScreenState extends State<RegisterScreen> {
  String? errorMessage;
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  
  void navigateToLogin() {
  Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (context) => const LoginScreen()),
  );
}

  Future<void> register() async {
  if (passwordController.text != confirmPasswordController.text) {
    setState(() {
      errorMessage = 'Passwords do not match!';
    });
    return;
  }

  const String url = 'http://10.0.2.2:8080/auth/sign_up';
  final response = await http.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
    },
    body: json.encode({
      "username": usernameController.text,
      "email": emailController.text,
      "password": passwordController.text,
    }),
  );

  print('Status Code: ${response.statusCode}');
  print('Response Body: ${response.body}');

  if (response.statusCode == 200) {
    final Map<String, dynamic> data = json.decode(response.body);
    final token = data['token'];
  navigateToLogin();
} else {
  setState(() {
    errorMessage = 'Error registering. Please try again.';
  });
}

}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(0, 60, 0, 0),
              child: Center(
                child: Text(
                  'Create Your Account',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 30.0,
                    fontWeight: FontWeight.w800,
                    fontFamily: 'Archivo',
                    height: 1.465,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 50),
            MyInput(
              hint: 'Username',
              controller: usernameController,
            ),
            const SizedBox(height: 20),
            MyInput(
              hint: 'Email',
              controller: emailController,
            ),
            const SizedBox(height: 20),
            MyInput(
              hint: 'Password',
              obscureText: true,
              controller: passwordController,
            ),
            const SizedBox(height: 20),
            MyInput(
              hint: 'Confirm Password',
              obscureText: true,
              controller: confirmPasswordController,
            ),
            const SizedBox(height: 20),
            if (errorMessage != null)
      Text(
        errorMessage!,
        style: const TextStyle(color: Colors.red),
      ),
            const SizedBox(height: 40),
            MyButton(
            onPressed: register,
            label: 'Sign Up',
          ),
          RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: const TextStyle(
          color: Color(0xFF8E949A),
          fontFamily: 'Cabin',
          fontSize: 18,
          fontWeight: FontWeight.w400,
          height: 1.465,
        ),
        children: [
          const TextSpan(text: "Already have an account ? "),
          WidgetSpan(
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              child: const Text(
                "Sign in",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                ),
              ),
            ),
          ),
        ],
      ),
    ),
          ],
        ),
      ),
    );
  }
}
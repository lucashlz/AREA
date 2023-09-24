import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'home_screen.dart';
import '../components/login_button.dart';
import '../components/login_input.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String? errorMessage;

void navigateToHome() {
  Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (context) => const HomeScreen()),
  );
}

Future<void> login() async {
  const String url = 'http://10.0.2.2:8080/auth/sign_in';
  final response = await http.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
    },
    body: json.encode({
      "email": emailController.text,
      "password": passwordController.text,
    }),
  );

  print('Status Code: ${response.statusCode}');
  print('Response Body: ${response.body}');

  if (response.statusCode == 200) {
    final Map<String, dynamic> data = json.decode(response.body);
    final token = data['token'];
    navigateToHome();
  } else {
    setState(() {
      errorMessage = 'Invalid email or password';
    });
  }
}



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
    LoginInput(
          hint: "Username",
          controller: emailController,
        ),
        const SizedBox(height: 20),
        LoginInput(
          hint: "Password",
          obscureText: true,
          controller: passwordController,
        ),
        const SizedBox(height: 20),
        if (errorMessage != null) // Display error if it exists
          Text(
            errorMessage!,
            style: const TextStyle(color: Colors.red),
          ),
        const SizedBox(height: 50),
        Padding(
          padding: const EdgeInsets.only(top: 24),
          child: LoginButton(onPressed: login), // Change the onPressed action
        ),
      ],
            ),
          ],
      ),
    ),
    );
  }
}
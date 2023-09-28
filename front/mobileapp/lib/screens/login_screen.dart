import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'home_screen.dart';
import 'register_screen.dart';
import '../components/my_button.dart';
import '../components/my_input.dart';

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
  } else if(response.statusCode == 400) {
    setState(() {
    errorMessage = 'Please validate your email before login.';
    });
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
            const SizedBox(height: 40),
            Center(
              child: Image.asset('assets/logo_ifttt.png'),
            ),
            const SizedBox(height: 60),
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
    MyInput(
          hint: "Username",
          controller: emailController,
        ),
        const SizedBox(height: 20),
        MyInput(
          hint: "Password",
          obscureText: true,
          controller: passwordController,
        ),
        const SizedBox(height: 20),
        
    if (errorMessage != null)
      Text(
        errorMessage!,
        style: const TextStyle(color: Colors.red),
      ),
    const SizedBox(height: 35),
    Padding(
      padding: const EdgeInsets.only(top: 24),
      child: MyButton(onPressed: login),
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
          const TextSpan(text: "Don't have an account? "),
          WidgetSpan(
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const RegisterScreen()),
                );
              },
              child: const Text(
                "Sign up",
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
          ],
        ),
    ),
    );
  }
}
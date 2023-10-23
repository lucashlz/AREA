import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:webview_flutter/webview_flutter.dart';
import '../main_container.dart';
import 'register_screen.dart';
import 'reset_password_screen.dart';
import '../components/my_button.dart';
import '../components/my_input.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    MaterialPageRoute(builder: (context) => const MainContainer()),
  );
}

void continueWithGoogle() {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => const LoginWebView()),
  );
}

Future<void> login() async {
  const String url = 'http://10.0.2.2:8080/auth/sign-in';
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
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    navigateToHome();
  } else if(response.statusCode == 400) {
    setState(() {
    errorMessage = 'Please verify your mail is verified and your password and email are corrects.';
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
        const SizedBox(height: 12),
      Align(
                  alignment: Alignment.centerRight,
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ResetPasswordScreen()),
                      );
                    },
                    child: const Padding(
                      padding: EdgeInsets.only(right: 23.0),
                      child: Text(
                        "Forgot Password?",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),
      ),
    if (errorMessage != null)
      Text(
        errorMessage!,
        style: const TextStyle(color: Colors.red),
      ),
    const SizedBox(height: 35),
    Padding(
      padding: const EdgeInsets.only(top: 24),
      child: MyButton(onPressed: login, fontSize: 30,),
    ),
    const SizedBox(height: 20),
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
const SizedBox(height: 20),
const Text(
  "Or continue with",
  textAlign: TextAlign.center,
  style: TextStyle(
    color: Color(0xFF8E949A),
    fontSize: 18,
  ),
),
const SizedBox(height: 20),
GestureDetector(
  onTap: continueWithGoogle,
  child: Center(
    child: Image.asset(
      'assets/logo_google.png',
      width: 50,
    ),
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

class LoginWebView extends StatefulWidget {
  const LoginWebView({Key? key}) : super(key: key);

  @override
  LoginWebViewState createState() => LoginWebViewState();
}

class LoginWebViewState extends State<LoginWebView> {
  final String url = "http://10.0.2.2:8080/auth/google";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login with Google'),
      ),
      body: WebView(
        initialUrl: url,
        navigationDelegate: (NavigationRequest request) {
          if (request.url.startsWith('http://10.0.2.2:8080/auth/google')) {

            Navigator.of(context).pop();
            return NavigationDecision.prevent;
          }

          return NavigationDecision.navigate;
        },
        javascriptMode: JavascriptMode.unrestricted,
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import './login_screen.dart';
import '../components/my_button.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({Key? key}) : super(key: key);

  @override
  AccountPageState createState() => AccountPageState();
}

class AccountPageState extends State<AccountPage> {
  String? _username;

  @override
  void initState() {
    super.initState();
    _loadProfileFromAPI();
  }

  void navigateToLogin() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  Future<void> _loadProfileFromAPI() async {
    const String url = 'http://10.0.2.2:8080/profile';
    
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    
    if (token == null) {
      navigateToLogin();
      return;
    }

    final response = await http.get(Uri.parse(url), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      setState(() {
        _username = data['username'];
      });
    } else {
      print('Error fetching profile: ${response.statusCode}');
    }
  }

  _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    navigateToLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0,),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Welcome, $_username!',
                style: const TextStyle(color: Colors.white, fontSize: 30),
              ),
              const SizedBox(height: 80),
              MyButton(
                onPressed: () {},
                label: 'Change Email',
                fontSize: 24,
              ),
              const SizedBox(height: 30),
              MyButton(
                onPressed: () {},
                label: 'Change Password',
                fontSize: 24,
              ),
              const SizedBox(height: 130),
              MyButton(
                onPressed: _logout,
                label: 'Logout',
                color: Colors.red,
                fontSize: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
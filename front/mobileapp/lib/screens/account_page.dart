import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import './login_screen.dart';

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
    _loadUsername();
  }

  _loadUsername() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _username = prefs.getString('username');
    });
  }

  _changeEmail() {
    // Implement the change email functionality
  }

  _changePassword() {
    // Implement the change password functionality
  }

  _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 50.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome, $_username!',
              style: const TextStyle(color: Colors.white, fontSize: 24),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: _changeEmail,
              child: const Text('Change Email'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _changePassword,
              child: const Text('Change Password'),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: _logout,
              style: ElevatedButton.styleFrom(
                // ignore: deprecated_member_use
                primary: Colors.red,
              ),
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}

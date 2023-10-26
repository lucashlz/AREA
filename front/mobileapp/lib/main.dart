import 'package:flutter/material.dart';
import './screens/login_screen.dart';
import 'package:provider/provider.dart';
import './components/area_creation_state.dart'; // Adjust the path as necessary.

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AreaCreationState(),
      child: MaterialApp(
        title: 'Login App',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const LoginScreen(),
      ),
    );
  }
}


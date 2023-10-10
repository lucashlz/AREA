import 'package:flutter/material.dart';
import '../services/services_view.dart';
import '../components/my_button.dart';

class AddPage extends StatelessWidget {
  const AddPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            MyButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ServicesView()),
                );
              },
              label: "Create applet",
              fontSize: 20,
            ),
          ],
        ),
      ),
    );
  }
}

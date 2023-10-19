import 'package:flutter/material.dart';
import '../services/triggers_view.dart';

class AreaComponent extends StatelessWidget {
  const AreaComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ServicesView()),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: const Center(
          child: CircleAvatar(
            backgroundColor: Color(0xFF1D1D1D),
            child: Text(
              'Add',
              style: TextStyle(
                fontFamily: 'Archivo',
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

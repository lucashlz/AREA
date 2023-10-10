import 'package:flutter/material.dart';
import '../services/service.dart';

class ServiceCard extends StatelessWidget {
  final Service service;

  const ServiceCard({Key? key, required this.service}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Color(int.parse('0xFF${service.color.substring(1)}')),
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
      ),
      child: SizedBox(
        height: 120,
        width: 120, 
        child: Center(child: Text(
          service.name,
          style: const TextStyle(
          color: Colors.white,
          fontFamily: 'Archivo',
          fontSize: 20,
          ),
          )),
      ),
    );
  }
}

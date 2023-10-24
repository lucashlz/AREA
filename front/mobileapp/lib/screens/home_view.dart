import 'package:flutter/material.dart';
import '../components/search_bar.dart';
import '../components/servicecard_triggers.dart';
import '../services/service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

Future<List<Service>> fetchServices() async {
  const String url = 'http://10.0.2.2:8080/about/about.json';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  final response = await http.get(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 200) {
    final Map<String, dynamic> data = json.decode(response.body);
    final List<dynamic> servicesData = data['server']['services'] ?? [];

    if (servicesData.isNotEmpty) {
      return servicesData
          .map((serviceData) => Service.fromJson(serviceData))
          .toList();
    } else {
      throw Exception('No services found in the response');
    }
  } else {
    throw Exception('Failed to load services');
  }
}

class HomeView extends StatefulWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  HomeViewState createState() => HomeViewState();
}

class HomeViewState extends State<HomeView> {
  final Future<List<Service>> futureServices = fetchServices();
  String _searchQuery = '';

  List<Service> _filterServices(List<Service> services) {
    if (_searchQuery.isEmpty) {
      return services;
    }
    return services
        .where((service) =>
            service.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Column(
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.only(top: 60.0, bottom: 20.0),
            child: Center(
              child: Text(
                'HOME',
                style: TextStyle(
                  color: Color(0xFFFFFFFF),
                  fontFamily: 'Archivo',
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: SizedBox(
              width: 359,
              height: 63,
              child: MySearchBar(
                onChanged: (query) {
                  setState(() {
                    _searchQuery = query;
                  });
                },
              ),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Service>>(
              future: futureServices,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else if (snapshot.data == null || snapshot.data!.isEmpty) {
                  return const Text('No services found.');
                } else {
                  final services = _filterServices(snapshot.data!);
                  return ListView.builder(
                    itemCount: services.length,
                    itemBuilder: (ctx, index) =>
                        ServiceCardTriggers(service: services[index]),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

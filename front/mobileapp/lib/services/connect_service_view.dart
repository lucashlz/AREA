import 'package:flutter/material.dart';
import '../services/service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'oauth_service.dart';
import 'package:flutter_web_browser/flutter_web_browser.dart';

String capitalize(String input) {
  if (input.isEmpty) {
    return input;
  }
  return input[0].toUpperCase() + input.substring(1);
}

class ConnectServiceView extends StatelessWidget {
  final Service service;

  const ConnectServiceView({Key? key, required this.service}) : super(key: key);

  Future<void> connectService(String serviceName) async {
    final String url =
        'http://10.0.2.2:8080/connect/get${Uri.encodeComponent(serviceName)}OAuthConstants';

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token == null) {
      print("No token found");
      return;
    }

    try {
      final response = await http.get(Uri.parse(url), headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final String clientId = data['clientId'];
        final String redirectUri = data['redirectUri'];
        final List<String> scopes = List<String>.from(data['scopes']);
        final String oAuthSessionId = data['oAuthSessionId'];

        String authorizationUrl = buildAuthorizationUrl(
          serviceName: serviceName,
          clientId: clientId,
          redirectUri: redirectUri,
          scopes: scopes,
          oAuthSessionId: oAuthSessionId,
        );

        print('Opening URL : $authorizationUrl');
        FlutterWebBrowser.openWebPage(url: authorizationUrl);
      } else {
        print('Request failed with status code : ${response.statusCode}.');
      }
    } catch (e) {
      print('Error occurred: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    Color backgroundColor =
        Color(int.parse('0xFF${service.color.substring(1)}'));
    HSLColor hslColor = HSLColor.fromColor(backgroundColor);
    HSLColor hslDarkerColor =
        hslColor.withLightness((hslColor.lightness - 0.1).clamp(0.0, 1.0));
    Color darkerBackgroundColor = hslDarkerColor.toColor();
    String serviceName = capitalize(service.name);
    String logoAssetName = 'assets/servicesLogo/${service.name}.png';

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: 20),
              Text(
                'Connect the service',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Archivo',
                ),
                textAlign: TextAlign.center,
              ),
              Flexible(
                flex: 1,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Image.asset(logoAssetName, height: 64, width: 64),
                    SizedBox(height: 20),
                    Text(
                      'Connect to $serviceName to continue',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 35,
                        fontFamily: 'Archivo',
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 160),
                  ],
                ),
              ),
              Flexible(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 10),
                    TextButton(
                      style: TextButton.styleFrom(
                        backgroundColor: darkerBackgroundColor,
                        padding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 80),
                        textStyle: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Archivo',
                        ),
                        primary: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                      ),
                      onPressed: () {
                        connectService(service.name);
                      },
                      child: Text('Connect'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

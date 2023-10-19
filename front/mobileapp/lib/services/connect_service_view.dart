import 'package:flutter/material.dart';
import '../services/service.dart';

class ConnectServiceView extends StatelessWidget {
  final Service service;

  const ConnectServiceView({Key? key, required this.service}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color backgroundColor = Color(int.parse('0xFF${service.color.substring(1)}'));
    HSLColor hslColor = HSLColor.fromColor(backgroundColor);
    HSLColor hslDarkerColor = hslColor.withLightness((hslColor.lightness - 0.1).clamp(0.0, 1.0));
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
                        padding: EdgeInsets.symmetric(vertical: 15, horizontal: 80),
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
                        // LOGIC HEERRRE
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

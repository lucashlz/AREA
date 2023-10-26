import 'package:flutter/material.dart';
import './trigger.dart';
import './service.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';

String formatTriggerParameter(String original) {
  return original
      .split('_')
      .map((str) => '${str[0].toUpperCase()}${str.substring(1)}')
      .join(' ');
}

class TriggerParameterInputPage extends StatelessWidget {
  final Service service;
  final Trigger trigger;

  TriggerParameterInputPage({required this.service, required this.trigger});

  @override
  Widget build(BuildContext context) {
    Color backgroundColor =
        Color(int.parse('0xFF${service.color.substring(1)}'));
    String logoAssetName = 'assets/servicesLogo/${service.name}.png';
    final areaState = Provider.of<AreaCreationState>(context, listen: false);

    return Scaffold(
      backgroundColor: backgroundColor, // Set the scaffold background color
      body: Column(
        children: [
          Container(
            color: backgroundColor,
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                children: [
                  SizedBox(height: 55),
                  Text(
                    'Input Parameters',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Archivo',
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 50),
                  Image.asset(logoAssetName, height: 64, width: 64),
                  SizedBox(height: 70),
                ],
              ),
            ),
          ),
          Expanded(
            child: Container(
              color: backgroundColor,
              child: ListView.builder(
                itemCount: trigger.parameters.length,
                itemBuilder: (context, index) {
                  final parameter = trigger.parameters[index];
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(40.0, 10.0, 40.0, 15.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          formatTriggerParameter(parameter['name']!),
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                        SizedBox(height: 8),
                        TextFormField(
                          style: TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Color(0xFF1D1D1D),
                            hintText: parameter['input'],
                            labelStyle: TextStyle(color: Colors.white),
                            hintStyle: TextStyle(color: Colors.white54),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8.0),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8.0),
                              borderSide: BorderSide(color: Colors.white54),
                            ),
                          ),
                          onChanged: (value) {
                            // Handle the input change
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
            child: ElevatedButton(
              onPressed: () {
                final parameters = trigger.parameters.map((param) {
                  return {
                    'name': param['name'],
                    'input': "INPUT_VALUE_HERE" // TODO: Fetch the input value from the TextFormField
                  };
                }).toList();

                // Step 2: Replace the _areaState with the obtained instance
                areaState.setTrigger({
                  'service': service.name,
                  'name': trigger.name,
                  'parameters': parameters,
                });

                Navigator.popUntil(context, (route) => route.isFirst);

              },
              style: ElevatedButton.styleFrom(
                primary: Colors.white,
                onPrimary: Color(0xFF1D1D1D),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 16.0),
              ),
              child: Text("Add", style: TextStyle(fontSize: 18)),
            ),
          ),
          SizedBox(height: 10),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../services/services_with_triggers_view.dart';
import '../services/services_with_actions_view.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> createArea(
    Map<String, dynamic> trigger, Map<String, dynamic> action) async {
  final url = 'http://10.0.2.2:8080/areas';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  final payload = {
    "trigger": trigger,
    "actions": [action]
  };

  final response = await http.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: json.encode(payload),
  );

  if (response.statusCode != 200) {
    throw Exception(
        'Failed to create area ${response.statusCode}   ${json.encode(payload)}                ${response.body}');
  }
}

String formatTriggerName(String original) {
  return original
      .split('_')
      .map((str) => '${str[0].toUpperCase()}${str.substring(1)}')
      .join(' ');
}

class CreatePage extends StatefulWidget {
  const CreatePage({Key? key}) : super(key: key);

  @override
  _CreatePageState createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  late final AreaCreationState _areaState;

  @override
  void initState() {
    super.initState();
    _areaState = Provider.of<AreaCreationState>(context, listen: false);
  }

  void _navigateToSelectTrigger(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TriggersView()),
    );

    if (result != null && result is Map<String, dynamic>) {
      _areaState.setTrigger(result['triggerData']);
    }
  }

  void _navigateToSelectAction(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ActionsView()),
    );

    if (result != null && result is Map<String, dynamic>) {
      _areaState.setAction(result['actionData']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Consumer<AreaCreationState>(
        builder: (context, areaState, child) {
          Color buttonColor = Colors.white;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: const Icon(
                    Icons.close,
                    color: Colors.white,
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                child: Center(
                  child: Text(
                    'Create',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Archivo',
                      fontSize: 30,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: areaState.trigger.isEmpty
                            ? () => _navigateToSelectTrigger(context)
                            : null,
                        child: Container(
                          constraints: BoxConstraints(
                            minWidth: 300,
                            minHeight: 70,
                            maxWidth: 320,
                          ),
                          decoration: BoxDecoration(
                            color: buttonColor,
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Center(
                                  child: RichText(
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: areaState.trigger.isEmpty
                                              ? 'If This'
                                              : 'If ',
                                          style: TextStyle(
                                            fontFamily: 'Archivo',
                                            color: const Color(0xFF1D1D1D),
                                            fontSize: 40.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        if (!areaState.trigger.isEmpty)
                                          TextSpan(
                                            text: formatTriggerName(
                                                areaState.trigger['name']),
                                            style: TextStyle(
                                              fontFamily: 'Archivo',
                                              color: const Color(0xFF1D1D1D),
                                              fontSize: 15.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              if (!areaState.trigger.isEmpty)
                                IconButton(
                                  icon: Icon(
                                    Icons.delete,
                                    color: const Color(0xFF1D1D1D),
                                  ),
                                  onPressed: () {
                                    areaState.setTrigger({});
                                  },
                                ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 50),
                      GestureDetector(
                        onTap: areaState.trigger.isEmpty ||
                                areaState.action.isNotEmpty
                            ? null
                            : () => _navigateToSelectAction(context),
                        child: Container(
                          constraints: BoxConstraints(
                            minWidth: 300,
                            minHeight: 70,
                            maxWidth: 320,
                          ),
                          decoration: BoxDecoration(
                            color: areaState.trigger.isEmpty
                                ? Colors.grey
                                : Colors.white,
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Center(
                                  child: RichText(
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: areaState.action.isEmpty
                                              ? 'Then That'
                                              : 'Then ',
                                          style: TextStyle(
                                            fontFamily: 'Archivo',
                                            color: const Color(0xFF1D1D1D),
                                            fontSize: 40.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        if (!areaState.action.isEmpty)
                                          TextSpan(
                                            text: formatTriggerName(
                                                areaState.action['name']),
                                            style: TextStyle(
                                              fontFamily: 'Archivo',
                                              color: const Color(0xFF1D1D1D),
                                              fontSize: 15.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              if (!areaState.action.isEmpty)
                                IconButton(
                                  icon: Icon(
                                    Icons.delete,
                                    color: const Color(0xFF1D1D1D),
                                  ),
                                  onPressed: () {
                                    areaState.setAction({});
                                  },
                                ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (areaState.trigger.isNotEmpty &&
                  areaState.action.isNotEmpty) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16.0, vertical: 10.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      try {
                        await createArea(areaState.trigger, areaState.action);
                        Navigator.popUntil(context, (route) => route.isFirst);
                      } catch (e) {
                        // Handle the exception or show an error message to the user
                        print('Error: $e');
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      onPrimary: Color(0xFF1D1D1D),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 50, vertical: 16.0),
                    ),
                    child: Text("Create", style: TextStyle(fontSize: 18)),
                  ),
                ),
                SizedBox(height: 10),
              ],
            ],
          );
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../services/services_with_triggers_view.dart';
import '../services/services_with_actions_view.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fluttertoast/fluttertoast.dart';

Future<String> createArea(
    Map<String, dynamic> trigger, List<Map<String, dynamic>> actions) async {
  final url = 'http://10.0.2.2:8080/areas';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  // Create a copy of the trigger and remove the ingredients key
  final triggerCopy = Map<String, dynamic>.from(trigger);
  triggerCopy.remove('ingredients');

  final payload = {
    "trigger": triggerCopy,
    "actions": actions,
  };

  final response = await http.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: json.encode(payload),
  );

  if (response.statusCode == 200) {
    print(response.body);
    return json.decode(response.body)['message'];  // <-- parse the message
  } else {
    print(response.body);
    throw Exception(json.decode(response.body)['message']);  // <-- parse the error message
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
  int numberOfThenThatButtons = 1;
  String _serverMessage = ''; // to store the server's response message
  Color _serverMessageColor = Colors.green;

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
      _areaState.addAction(result['actionData']);
      setState(() {
        numberOfThenThatButtons = _areaState.actions.length + 1;
      });
    }
  }

  Widget _buildContainer(String text, Color buttonColor, VoidCallback? onTap,
      [int? index]) {
    bool showAddButton = text != 'Then That' || (_areaState.trigger.isNotEmpty);
    bool showTrashButton = text == 'Then That' && index != null && index > 0;

    Widget textWidget = Text(
      text,
      style: TextStyle(
        fontFamily: 'Archivo',
        color: const Color(0xFF1D1D1D),
        fontSize: 35.0,
        fontWeight: FontWeight.bold,
      ),
      textAlign: TextAlign.center,
    );

    if (showTrashButton) {
      textWidget = Expanded(child: textWidget);
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        constraints: BoxConstraints(
          minWidth: 300,
          minHeight: 80,
          maxWidth: 380,
        ),
        decoration: BoxDecoration(
          color: buttonColor,
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              textWidget,
              if (showAddButton) SizedBox(width: 20.0),
              if (showAddButton)
                ElevatedButton(
                  onPressed: onTap,
                  child: Text(
                    "Add",
                    style: TextStyle(
                      fontFamily: 'Archivo',
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    primary: const Color(0xFF1D1D1D),
                    onPrimary: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                  ),
                ),
              if (showTrashButton)
                Padding(
                  padding: const EdgeInsets.only(left: 10.0),
                  child: IconButton(
                    icon: Icon(
                      Icons.delete,
                      color: const Color(0xFF1D1D1D),
                    ),
                    onPressed: () {
                      setState(() {
                        numberOfThenThatButtons--;
                      });
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionContainer(
      Map<String, dynamic> action, Color buttonColor, int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: GestureDetector(
        onTap: () => _navigateToSelectAction(context),
        child: Container(
          constraints: BoxConstraints(
            minWidth: 300,
            minHeight: 80,
            maxWidth: 380,
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
                          text: action.isEmpty ? 'Then That' : 'Then ',
                          style: TextStyle(
                            fontFamily: 'Archivo',
                            color: const Color(0xFF1D1D1D),
                            fontSize: 35.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (!action.isEmpty)
                          TextSpan(
                            text: formatTriggerName(action['name']),
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
              if (index > 0 || !action.isEmpty)
                IconButton(
                  icon: Icon(
                    Icons.delete,
                    color: const Color(0xFF1D1D1D),
                  ),
                  onPressed: () {
                    if (!action.isEmpty) {
                      int actionIndex = _areaState.actions.indexOf(action);
                      _areaState.removeAction(actionIndex);
                      setState(() {
                        numberOfThenThatButtons = _areaState.actions.length + 1;
                      });
                    } else {
                      setState(() {
                        numberOfThenThatButtons--;
                      });
                    }
                  },
                )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSelectedContainer(
    String text,
    Color buttonColor,
    VoidCallback onPressed,
    double titleFontSize,
    FontWeight titleFontWeight,
    double itemFontSize,
    FontWeight itemFontWeight,
  ) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        constraints: BoxConstraints(
          minWidth: 300,
          minHeight: 80,
          maxWidth: 380,
        ),
        decoration: BoxDecoration(
          color: buttonColor,
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0),
                child: RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: text.split(' ').first,
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: const Color(0xFF1D1D1D),
                          fontSize: titleFontSize,
                          fontWeight: titleFontWeight,
                        ),
                      ),
                      TextSpan(
                        text: formatTriggerName(' ' + text.split(' ').last),
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: const Color(0xFF1D1D1D),
                          fontSize: itemFontSize,
                          fontWeight: itemFontWeight,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            IconButton(
              icon: Icon(
                Icons.delete,
                color: const Color(0xFF1D1D1D),
              ),
              onPressed: onPressed,
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Consumer<AreaCreationState>(
        builder: (context, areaState, child) {
          Color buttonColor = Colors.white;
          Color thenButtonColor =
              areaState.trigger.isEmpty ? Colors.grey : Colors.white;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
                  child: Center(
                    child: Text(
                      'CREATE',
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Archivo',
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 50.0),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _areaState.trigger.isEmpty
                          ? _buildContainer('If This', buttonColor,
                              () => _navigateToSelectTrigger(context))
                          : _buildSelectedContainer(
                              "If   ${_areaState.trigger['name']}",
                              buttonColor,
                              () => _areaState.setTrigger({}),
                              35.0,
                              FontWeight.bold,
                              15.0,
                              FontWeight.normal),
                      SizedBox(height: 50),
                      for (int i = 0; i < numberOfThenThatButtons; i++)
                        if (i < _areaState.actions.length)
                          _buildActionContainer(
                              i < _areaState.actions.length
                                  ? _areaState.actions[i]
                                  : {},
                              buttonColor,
                              i)
                        else
                          _buildContainer(
                              'Then That',
                              thenButtonColor,
                              _areaState.trigger.isEmpty
                                  ? null
                                  : () => _navigateToSelectAction(context),
                              i),
                      if (_areaState.trigger.isNotEmpty &&
                          numberOfThenThatButtons == _areaState.actions.length)
                        Padding(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 140.0),
                          child: IconButton(
                            icon: Icon(Icons.add_circle_outline,
                                color: Colors.white, size: 40),
                            onPressed: () {
                              setState(() {
                                numberOfThenThatButtons += 1;
                              });
                            },
                          ),
                        ),
                      SizedBox(height: 30),
                    ],
                  ),
                ),
                if (areaState.trigger.isNotEmpty &&
                    areaState.actions.isNotEmpty) ...[
                  if (_serverMessage.isNotEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Text(
                          _serverMessage,
                          style: TextStyle(color: _serverMessageColor, fontSize: 16),
                        ),
                      ),
                    ),
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16.0, vertical: 10.0),
                      child: ElevatedButton(
                        onPressed: () async {
                          try {
                            String message = await createArea(
                                areaState.trigger, areaState.actions);
                            setState(() {
                              _serverMessage = message;
                              _serverMessageColor = Colors.green;
                            });
                            // Display toast notification
                            Fluttertoast.showToast(msg: message);
                            // Clear the area state
                            areaState.clearArea();
                          } catch (e) {
                            setState(() {
                              _serverMessage = e.toString();
                              _serverMessageColor = Colors.red;
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          primary: Colors.white,
                          onPrimary: Color(0xFF1D1D1D),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                          padding: EdgeInsets.symmetric(
                              horizontal: 50, vertical: 16.0),
                        ),
                        child: Text("Create", style: TextStyle(fontSize: 18)),
                      ),
                    ),
                  ),
                  SizedBox(height: 30),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

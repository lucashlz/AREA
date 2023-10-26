import 'package:flutter/material.dart';
import '../services/services_with_triggers_view.dart';
import '../services/services_with_actions_view.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';

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
  late final AreaCreationState _areaState; // Declare the state

  @override
  void initState() {
    super.initState();
    _areaState = Provider.of<AreaCreationState>(context,
        listen: false); // Initialize the state
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
                          ), // Set the button's size constraints
                          decoration: BoxDecoration(
                            color: buttonColor,
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          child: Center(
                            child: Text(
                              areaState.trigger.isEmpty
                                  ? 'If This'
                                  : 'IF ${formatTriggerName(areaState.trigger['name'])}',
                              style: TextStyle(
                                fontFamily: 'Archivo',
                                color: const Color(0xFF1D1D1D),
                                fontSize: areaState.trigger.isEmpty
                                    ? 40.0
                                    : 24.0,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 50),
                      GestureDetector(
                        onTap: areaState.trigger.isEmpty || areaState.action.isNotEmpty
                          ? null
                          : () => _navigateToSelectAction(context),
                        child: Container(
                          constraints: BoxConstraints(
                            minWidth: 300,
                            minHeight: 70,
                            maxWidth: 320,
                          ),
                          padding: EdgeInsets.symmetric(
                              horizontal: 66.0, vertical: 12.0),
                          decoration: BoxDecoration(
                            color: areaState.trigger.isEmpty
                                ? Colors.grey
                                : Colors.white,
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          child: Text(
                            areaState.action.isEmpty
                                  ? 'Then That'
                                  : formatTriggerName(areaState.action['name']),
                            style: TextStyle(
                              fontFamily: 'Archivo',
                              color: const Color(0xFF1D1D1D),
                              fontSize: areaState.action.isEmpty
                                    ? 40.0
                                    : 24.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

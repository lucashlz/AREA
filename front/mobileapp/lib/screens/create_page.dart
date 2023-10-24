import 'package:flutter/material.dart';
import '../services/services_with_triggers_view.dart';
import '../services/services_with_actions_view.dart';

class CreatePage extends StatefulWidget {
  const CreatePage({Key? key}) : super(key: key);

  @override
  _CreatePageState createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  bool _triggerSelected = false;

  void _navigateToSelectTrigger(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TriggersView()),
    );

    if (result != null) {
      setState(() {
        _triggerSelected = true;
      });
    }
  }

  void _navigateToSelectAction(BuildContext context) {
    if (!_triggerSelected) return;

    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ActionsView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Column(
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
                    onTap: () => _navigateToSelectTrigger(context),
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 100.0, vertical: 12.0),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15.0),
                      ),
                      child: Text(
                        'If This',
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: const Color(0xFF1D1D1D),
                          fontSize: 40.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 50),
                  GestureDetector(
                    onTap: () => _navigateToSelectAction(context),
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 66.0, vertical: 12.0),
                      decoration: BoxDecoration(
                        color: _triggerSelected ? Colors.white : Colors.grey,
                        borderRadius: BorderRadius.circular(15.0),
                      ),
                      child: Text(
                        'Then That',
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: const Color(0xFF1D1D1D),
                          fontSize: 40.0,
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
      ),
    );
  }
}

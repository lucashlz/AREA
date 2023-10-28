import 'package:flutter/foundation.dart';
import 'area_model.dart';

class AreaCreationState extends ChangeNotifier {
  Map<String, dynamic> _trigger = {};
  List<Map<String, dynamic>> _actions = [];  // Now it's a list of actions

  Map<String, dynamic> get trigger => _trigger;
  List<Map<String, dynamic>> get actions => _actions;  // Getter for the list of actions

  void setTrigger(Map<String, dynamic> trigger) {
    _trigger = trigger;
    notifyListeners();
  }

  void addAction(Map<String, dynamic> action) {
    _actions.add(action);
    notifyListeners();
  }

  void removeAction(int index) {
    _actions.removeAt(index);
    notifyListeners();
  }

  void clearActions() {
    _actions = [];
    notifyListeners();
  }

  Area compileArea() {
    return Area(_trigger, _actions);
  }
}

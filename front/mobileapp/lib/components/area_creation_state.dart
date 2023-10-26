import 'package:flutter/foundation.dart';
import 'area_model.dart';

class AreaCreationState extends ChangeNotifier {
  Map<String, dynamic> _trigger = {};
  Map<String, dynamic> _action = {};

  Map<String, dynamic> get trigger => _trigger;
  Map<String, dynamic> get action => _action;

  void setTrigger(Map<String, dynamic> trigger) {
    _trigger = trigger;
    notifyListeners();
  }

  void setAction(Map<String, dynamic> action) {
    _action = action;
    notifyListeners();
  }

  Area compileArea() {
    return Area(_trigger, _action);
  }

}

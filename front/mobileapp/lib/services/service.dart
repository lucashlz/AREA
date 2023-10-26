import 'trigger.dart';
import 'action.dart';  // Make sure to define this Action class similarly to the Trigger class

class Service {
  final String name;
  final String color;
  final List<Trigger> triggers;
  final List<Action> actions;  // New attribute for actions

  Service({
    required this.name,
    required this.color,
    required this.triggers,
    required this.actions,  // New initializer for actions
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    var triggerList = (json['triggers'] as List)
        .map((triggerJson) => Trigger.fromJson(triggerJson))
        .toList();

    var actionList = (json['actions'] as List)  // Assuming the actions key exists in your json
        .map((actionJson) => Action.fromJson(actionJson))
        .toList();

    return Service(
      name: json['name'],
      color: json['color'],
      triggers: triggerList,
      actions: actionList,  // Initializing actions here
    );
  }
}

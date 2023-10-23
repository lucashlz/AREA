String capitalize(String input) {
  if (input.isEmpty) {
    return input;
  }
  return input[0].toUpperCase() + input.substring(1);
}

class Service {
  final String name;
  final String color;
  List<Trigger> triggers;
  List<Action> actions; 

  Service({required this.name, required this.color, required this.triggers, required this.actions,});

  factory Service.fromJson(Map<String, dynamic> json) {
    var triggerList = json['triggers'] as List;
    List<Trigger> triggers = triggerList.map((i) => Trigger.fromJson(i)).toList();

    var actionList = json['actions'] as List;
    List<Action> actions = actionList.map((i) => Action.fromJson(i)).toList();
  
  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      name: json['name'],
      color: json['color'],
      triggers: triggers,
      actions: actions,
    );
  }
}

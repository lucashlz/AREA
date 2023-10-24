import 'trigger.dart';

String capitalize(String input) {
  if (input.isEmpty) {
    return input;
  }
  return input[0].toUpperCase() + input.substring(1);
}

class Service {
  final String name;
  final String color;
  final List<Trigger> triggers;

  Service({
    required this.name,
    required this.color,
    required this.triggers,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    var triggerList = (json['triggers'] as List)
        .map((triggerJson) => Trigger.fromJson(triggerJson))
        .toList();

    return Service(
      name: json['name'],
      color: json['color'],
      triggers: triggerList,
    );
  }
}

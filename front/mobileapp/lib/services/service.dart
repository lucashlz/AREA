String capitalize(String input) {
  if (input.isEmpty) {
    return input;
  }
  return input[0].toUpperCase() + input.substring(1);
}

class Service {
  final String name;
  final String color;

  Service({required this.name, required this.color});

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      name: json['name'],
      color: json['color'],
    );
  }
}

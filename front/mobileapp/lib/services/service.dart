class Service {
  final String name;
  final String color;
  // Add more attributes if needed like triggers and actions

  Service({required this.name, required this.color});

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      name: json['name'],
      color: json['color'],
      // Parse other attributes similarly
    );
  }
}

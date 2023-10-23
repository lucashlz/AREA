class Trigger {
  final String name;
  final String description;
  // ... any other fields ...

  Trigger({
    required this.name,
    required this.description,
    // ... any other fields ...
  });

  factory Trigger.fromJson(Map<String, dynamic> json) {
    return Trigger(
      name: json['name'],
      description: json['description'],
      // ... any other fields ...
    );
  }
}

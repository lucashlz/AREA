class Actions {
  final String name;
  final String description;

  Actions({
    required this.name,
    required this.description,
  });

  factory Actions.fromJson(Map<String, dynamic> json) {
    return Actions(
      name: json['name'],
      description: json['description'],
    );
  }
}

import 'package:flutter/material.dart';
import 'screens/account_page.dart';
import 'screens/home_view.dart';
import 'screens/create_page.dart';

class MainContainer extends StatefulWidget {
  const MainContainer({Key? key}) : super(key: key);

  @override
  MainContainerState createState() => MainContainerState();
}

class MainContainerState extends State<MainContainer> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    const HomeView(),
    const CreatePage(),
    const AccountPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        bottomNavigationBarTheme: BottomNavigationBarThemeData(
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white70,
          backgroundColor: const Color(0xFF1D1D1D),
        ),
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFF1D1D1D),
        body: _children[_currentIndex],
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: CircleAvatar(
                radius: 15,
                backgroundColor: Colors.white,
                child: Icon(Icons.add, color: Color(0xFF1D1D1D)),
              ),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_circle),
              label: '',
            ),
          ],
        ),
      ),
    );
  }

}

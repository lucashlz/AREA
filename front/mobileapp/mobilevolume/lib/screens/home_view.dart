import 'package:flutter/material.dart';
import '../components/search_bar.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.only(top: 60.0, bottom: 20.0),
            child: Center(
              child: Text(
                'HOME',
                style: TextStyle(
                  color: Color(0xFFFFFFFF),
                  fontFamily: 'Archivo',
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: SizedBox(
              width: 359,
              height: 63,
              child: MySearchBar(key: key,),
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}
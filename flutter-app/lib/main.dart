import 'package:flutter/material.dart';
import 'package:flutter_web_navigation/app.dart';
import 'package:url_strategy/url_strategy.dart';
import 'services/hive_storage_service.dart';

void main() async {
  // remove sharp(#) from url.
  setPathUrlStrategy();

  // check if user is logged-in and pass it to App.
  bool isUserLoggedIn = await HiveDataStorageService.getUser();
  runApp(App(
    isLoggedIn: isUserLoggedIn,
  ));
}

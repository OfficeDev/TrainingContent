//
//  EmailDetailViewController.m
//  O365-Exchange-App
//
//  Created by Lucas Damian Napoli on 28/10/14.
//  Copyright (c) 2014 MS Open Tech. All rights reserved.
//

#import "EmailDetailViewController.h"


@implementation EmailDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.navigationController.navigationBar setBackgroundImage:nil
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = nil;
    self.navigationController.navigationBar.translucent = NO;
    self.navigationController.view.tintColor = [UIColor colorWithRed:13.0/255.0 green:92.0/255.0 blue:173.0/255.0 alpha:1];
    self.navigationController.navigationBar.tintColor = [UIColor whiteColor];
    self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:13.0/255.0 green:92.0/255.0 blue:173.0/255.0 alpha:1];
    self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                                                   [UIColor whiteColor], NSForegroundColorAttributeName, nil];
    
    
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
    
    self.title = @"Detail";    
    
    self.author.text = self.currentMsg.from.emailAddress.name;
    self.subject.text = self.currentMsg.subject;
    
    [self.emailBody loadHTMLString:self.currentMsg.body.content  baseURL: nil];
    
    NSDate *msgDate = self.currentMsg.sentDateTime;
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"MM-dd-yyyy"];
    self.date.text = [formatter stringFromDate:msgDate];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}


@end

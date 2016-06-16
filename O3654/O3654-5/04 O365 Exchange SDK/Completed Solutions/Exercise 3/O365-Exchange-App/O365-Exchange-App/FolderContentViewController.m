//
//  FileDetailsViewController.m
//  O365-Files-App
//
//  Created by Lucas Damian Napoli on 24/10/14.
//  Copyright (c) 2014 MS Open Tech. All rights reserved.
//

#import "FolderContentViewController.h"
#import "EmailListTableViewCell.h"
#import "EmailDetailViewController.h"


@implementation FolderContentViewController

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
    double x = ((self.navigationController.view.frame.size.width) - 20)/ 2;
    double y = ((self.navigationController.view.frame.size.height) - 150)/ 2;
    self.spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(x, y, 20, 20)];
    self.spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:self.spinner];
    self.spinner.hidesWhenStopped = YES;
    
    self.folderName.text = self.currentFolder.displayName;
    self.title = self.currentFolder.displayName;
}

-(void) viewDidAppear:(BOOL)animated{
    self.currentMsg = nil;
    [self getFolderContent];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return [self.folderMessages count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSString* identifier = @"msgListCell";
    EmailListTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    MSGraphMessage *msg = [self.folderMessages objectAtIndex:indexPath.row];
    
    cell.title.text = msg.from.emailAddress.name;
    cell.subtitle.text = msg.bodyPreview;
    
    return cell;
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    
    EmailDetailViewController *controller = (EmailDetailViewController *)segue.destinationViewController;
    controller.currentMsg = self.currentMsg;
    
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    self.currentMsg= [self.folderMessages objectAtIndex:indexPath.row];
    
    [self performSegueWithIdentifier:@"msgDetail" sender:self];
}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender{
    return ([identifier isEqualToString:@"msgDetail"] && self.currentMsg);
}

-(UIStatusBarStyle)preferredStatusBarStyle{
    return UIStatusBarStyleLightContent;
}

-(void) getFolderContent{
    [self.spinner startAnimating];
    ExchangeGraphService *exchangeService =[[ExchangeGraphService alloc] init];
    [exchangeService getFolderContent:self.currentFolder.entityId callback:^(NSArray *messages, NSError *error) {
        self.folderMessages = messages;
        dispatch_async(dispatch_get_main_queue(),^{
            [self.spinner stopAnimating];
            [self.tableView reloadData];
        });
    }];
}

@end

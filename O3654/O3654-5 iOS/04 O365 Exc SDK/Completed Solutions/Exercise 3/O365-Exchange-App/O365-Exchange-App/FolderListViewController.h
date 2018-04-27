//
//  FileListViewController.h
//  O365-Files-App
//
//  Created by Lucas Damian Napoli on 24/10/14.
//  Copyright (c) 2014 MS Open Tech. All rights reserved.
//

#import "ViewController.h"
#import <MSGraphSDK.h>
#import "ExchangeGraphService.h"

@interface FolderListViewController : ViewController
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (nonatomic) UIActivityIndicatorView* spinner;

@property (nonatomic) NSArray *folders;
@property (nonatomic) MSGraphMailFolder *currentFolder;
@end

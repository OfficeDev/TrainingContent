#import "ViewController.h"
#import <MSGraphSDK.h>
#import "FileGraphService.h"

@interface FileListViewController : ViewController
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (nonatomic) UIActivityIndicatorView* spinner;

@property (nonatomic) NSArray *files;
@property (nonatomic) MSGraphDriveItem *currentFolder;
@end

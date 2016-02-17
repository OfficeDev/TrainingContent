#import "ViewController.h"
#import <MSGraph-SDK-iOS/MSGraphService.h>
#import "FileGraphService.h"

@interface FileListViewController : ViewController
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (nonatomic) UIActivityIndicatorView* spinner;
@property (nonatomic) NSArray *files;
@property (nonatomic) MSGraphServiceDriveItem *currentFolder;
@end

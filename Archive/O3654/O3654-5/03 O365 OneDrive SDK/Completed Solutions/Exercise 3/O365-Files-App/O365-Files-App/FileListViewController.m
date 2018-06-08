#import "FileListViewController.h"
#import "FileListCellTableViewCell.h"
#import "FileDetailsViewController.h"

@implementation FileListViewController

NSDateFormatter* formatter;

-(void) loadData{
    //Create and add a spinner
    
    [self.spinner startAnimating];
    
    FileGraphService * fileService =[[FileGraphService alloc] init];
    [fileService getFiles:^(NSArray *files, NSError *error) {
        self.files = files;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadData];
            [self.spinner stopAnimating];
        });
    }];
}

-(void) loadCurrentFolder{
    [self.spinner startAnimating];
    FileGraphService * fileService =[[FileGraphService alloc] init];
    [fileService getFolderFiles:self.currentFolder.entityId callback:^(NSArray *files, NSError *error) {
        self.files = files;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadData];
            [self.spinner stopAnimating];
        });
    }];
    
}

- (void)viewDidLoad {
    [super viewDidLoad];    
    [self initView];
 
    
    double x = ((self.navigationController.view.frame.size.width) - 20)/ 2;
    double y = ((self.navigationController.view.frame.size.height) - 150)/ 2;
    self.spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(x, y, 20, 20)];
    self.spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:self.spinner];
    self.spinner.hidesWhenStopped = YES;
    
    
    formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"MM-dd-yyyy"];
}

- (void)initView {
    [self.navigationController.navigationBar setBackgroundImage:nil
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = nil;
    self.navigationController.navigationBar.translucent = NO;
    self.navigationController.view.tintColor = [UIColor colorWithRed:226.0/255.0 green:37.0/255.0 blue:7.0/255.0 alpha:1];
    self.navigationController.navigationBar.tintColor = [UIColor whiteColor];
    self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:226.0/255.0 green:37.0/255.0 blue:7.0/255.0 alpha:1];
    self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                                                   [UIColor whiteColor], NSForegroundColorAttributeName, nil];
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}

- (void)viewWillAppear:(BOOL)animated{
    [self initView];
    
    if (!self.currentFolder){
        self.navigationController.title = @"File List";
        if (self.files == nil) {
            [self loadData];
        }
    }else{
        self.navigationController.title = self.currentFolder.name;
        if (self.files == nil) {
            [self loadCurrentFolder];
        }
    }
}

-(void) viewWillDisappear:(BOOL)animated {
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        [self.navigationController.navigationBar setBackgroundImage:[UIImage new]
                                                      forBarMetrics:UIBarMetricsDefault];
        self.navigationController.navigationBar.shadowImage = [UIImage new];
        self.navigationController.navigationBar.translucent = YES;
        self.navigationController.view.backgroundColor = [UIColor clearColor];
        [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleDefault];
    }
    [super viewWillDisappear:animated];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return self.files.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSString* identifier = @"fileListCell";
    FileListCellTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    MSGraphDriveItem *file = [self.files objectAtIndex:indexPath.row];
    
    NSString *lastModifiedString = [formatter stringFromDate:file.lastModifiedDateTime];
    
    cell.fileName.text = file.name;
    cell.lastModified.text = [NSString stringWithFormat:@"Last modified on %@", lastModifiedString];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    MSGraphDriveItem *currentEntity = [self.files objectAtIndex:indexPath.row];
    
    if ([currentEntity folder]!=nil){
        FileListViewController *controller = [[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"fileList"];
        controller.currentFolder = currentEntity;
        
        [self.navigationController pushViewController:controller animated:YES];
    }
    else{
        FileDetailsViewController *controller = [[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"fileDetail"];
        controller.file = [self.files objectAtIndex:indexPath.row];
        [self.navigationController pushViewController:controller animated:YES];
    }
}

-(UIStatusBarStyle)preferredStatusBarStyle{
    return UIStatusBarStyleLightContent;
}

@end

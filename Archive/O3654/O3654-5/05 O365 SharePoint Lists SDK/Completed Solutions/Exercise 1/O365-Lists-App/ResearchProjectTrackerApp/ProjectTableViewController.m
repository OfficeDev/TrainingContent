//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "ProjectTableViewController.h"
#import "ProjectTableViewCell.h"
#import "ProjectDetailsViewController.h"

@implementation ProjectTableViewController

UIView* popUpView;
UILabel* popUpLabel;
UIView* blockerPanel;
NSURLSessionDownloadTask* task;

#pragma mark Default Methods
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.navigationController.navigationBar setBackgroundImage:nil
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = nil;
    self.navigationController.navigationBar.translucent = NO;
    self.navigationController.view.tintColor = [UIColor colorWithRed:98.0/255.0 green:4.0/255.0 blue:126.0/255.0 alpha:1];
    self.navigationController.navigationBar.tintColor = [UIColor whiteColor];
    self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:98.0/255.0 green:4.0/255.0 blue:126.0/255.0 alpha:1];
    self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                                                   [UIColor whiteColor], NSForegroundColorAttributeName, nil];
    
    //ObjC array that will contain the project list items
    self.projectsList = [[NSMutableArray alloc] init];
}
#pragma mark -
#pragma mark Loading Projects
-(void)loadData{
    //Here must be either the list items gathering
    //or the creation of the list if it wasn't found.
    //Beginning with a spinner
            /*
                 UIActivityIndicatorView* spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(135,140,50,50)];
                 spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
                 [self.view addSubview:spinner];
                 spinner.hidesWhenStopped = YES;
             */
    //And then calling either:
            /*
                [self getProjectsFromList:spinner];
             */
    //or
            /*
                [self createProjectList:spinner];
             */
}

-(void)getProjectsFromList:(UIActivityIndicatorView *) spinner{
}


-(void)createProjectList:(UIActivityIndicatorView *) spinner{
}



#pragma mark -
#pragma mark Forward Navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if([segue.identifier isEqualToString:@"newProject"]){
        CreateViewController *controller = (CreateViewController *)segue.destinationViewController;
        controller.token = self.token;
    }else if([segue.identifier isEqualToString:@"detail"]){
        ProjectDetailsViewController *controller = (ProjectDetailsViewController *)segue.destinationViewController;
        controller.token = self.token;
    }
    
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self loadData];
}

#pragma mark -
#pragma mark Backwards Navigation
-(void) viewWillDisappear:(BOOL)animated {
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        [self.navigationController.navigationBar setBackgroundImage:[UIImage new]
                                                      forBarMetrics:UIBarMetricsDefault];
        self.navigationController.navigationBar.shadowImage = [UIImage new];
        self.navigationController.navigationBar.translucent = YES;
        self.navigationController.view.backgroundColor = [UIColor clearColor];
    }
    [super viewWillDisappear:animated];
}
- (void)Cancel{
    [task cancel];
    [self disposeBlockerPanel];
}
-(void)disposeBlockerPanel{
    blockerPanel.hidden = true;
    popUpView = nil;
    blockerPanel = nil;
    self.tableView.scrollEnabled = true;
    self.navigationController.navigationItem.backBarButtonItem.Enabled = true;
}
- (IBAction)backToLogin:(id)sender{
    [self.navigationController.navigationBar setBackgroundImage:[UIImage new]
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = [UIImage new];
    self.navigationController.navigationBar.translucent = YES;
    self.navigationController.view.backgroundColor = [UIColor clearColor];
}
#pragma mark -
#pragma mark Table actions
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 1;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString* identifier = @"ProjectListCell";
    ProjectTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    cell.ProjectName.text = @"aProject";
    
    return cell;
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //[self performSegueWithIdentifier:@"detail" sender:self];
}

@end
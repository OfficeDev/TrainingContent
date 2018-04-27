#import "FileDetailsViewController.h"

@implementation FileDetailsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self initView];
    
    double x = ((self.navigationController.view.frame.size.width) - 20)/ 2;
    double y = ((self.navigationController.view.frame.size.height) - 150)/ 2;
    self.spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(x, y, 20, 20)];
    self.spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:self.spinner];
    self.spinner.hidesWhenStopped = YES;
    [self.spinner startAnimating];
    
    self.fileName.text = self.file.name;
    self.lastModified.text = [self.file.lastModifiedDateTime description];
    self.created.text = [self.file.createdDateTime description];
    
    [self loadFile];
}

- (void) initView{
    
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

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) loadFile{
    
    [self.spinner startAnimating];
    
    FileGraphService * fileService =[[FileGraphService alloc] init];
    [fileService getFileContent:self.file.entityId callback:^(NSData *content, NSError *error) {
        NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString  *documentsDirectory = [paths objectAtIndex:0];
        
        NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,self.file.name];
        [content writeToFile:filePath atomically:YES];
        
        NSURL *fileUrl = [NSURL fileURLWithPath:filePath];
        
        self.docInteractionController = [UIDocumentInteractionController interactionControllerWithURL:fileUrl];
        self.docInteractionController.delegate = self;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.spinner stopAnimating];
        });
    }];
}

- (UIViewController *) documentInteractionControllerViewControllerForPreview: (UIDocumentInteractionController *) controller
{
    return [self navigationController];
}

- (IBAction)downloadAction:(id)sender {
    [self.docInteractionController presentPreviewAnimated:YES];
}
@end

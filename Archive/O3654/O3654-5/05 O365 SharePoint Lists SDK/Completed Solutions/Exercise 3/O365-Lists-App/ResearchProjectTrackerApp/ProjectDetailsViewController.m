//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "ProjectDetailsViewController.h"
#import "ReferencesTableViewCell.h"
#import "ReferenceDetailsViewController.h"
#import "CreateReferenceViewController.h"
#import "EditProjectViewController.h"
#import "ProjectClient.h"


@implementation ProjectDetailsViewController

//ViewController actions
#pragma mark -
#pragma mark Default Methods
-(void)viewDidLoad{
    self.projectName.text = [self.project valueForKey:@"Title"];
    self.navigationItem.title = [self.project valueForKey:@"Title"];
    self.navigationItem.rightBarButtonItem.title = @"Done";
    self.selectedReference = false;
    self.projectNameField.hidden = true;
}



#pragma mark -
#pragma mark Loading References
-(void)loadData{
    double x = ((self.navigationController.view.frame.size.width) - 20)/ 2;
    double y = ((self.navigationController.view.frame.size.height) - 150)/ 2;
    UIActivityIndicatorView* spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(x, y, 20, 20)];
    spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:spinner];
    spinner.hidesWhenStopped = YES;
    [spinner startAnimating];
    
    [self getReferences:spinner];
}

-(void)getReferences:(UIActivityIndicatorView *) spinner{
    ProjectClient* client = [[ProjectClient alloc] init];
    
    NSURLSessionTask* listReferencesTask = [client getReferencesByProjectId:[self.project valueForKey:@"Id"] token:self.token callback:^(NSMutableArray *listItems, NSError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            self.references = [listItems copy];
            [self.refencesTable reloadData];
            [spinner stopAnimating];
        });
        
    }];
    
    [listReferencesTask resume];
}

-(void)createReferencesList:(UIActivityIndicatorView *) spinner{
}


#pragma mark -
#pragma mark Forward Navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if([segue.identifier isEqualToString:@"createReference"]){
        CreateReferenceViewController *controller = (CreateReferenceViewController *)segue.destinationViewController;
        controller.project = self.project;
        controller.token = self.token;
    }else if([segue.identifier isEqualToString:@"referenceDetail"]){
        ReferenceDetailsViewController *controller = (ReferenceDetailsViewController *)segue.destinationViewController;
        controller.selectedReference = self.selectedReference;
        controller.token = self.token;
    }else if([segue.identifier isEqualToString:@"editProject"]){
        EditProjectViewController *controller = (EditProjectViewController *)segue.destinationViewController;
        controller.project = self.project;
        controller.token = self.token;
    }
    self.selectedReference = false;
}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender{
    return ([identifier isEqualToString:@"referenceDetail"] && self.selectedReference) || [identifier isEqualToString:@"createReference"] || [identifier isEqualToString:@"editProject"];
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self loadData];
}



#pragma mark -
#pragma mark Table actions
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString* identifier = @"referencesListCell";
    ReferencesTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    NSDictionary *item = [self.references objectAtIndex:indexPath.row];
    NSDictionary *dic =[item valueForKey:@"URL"];
    cell.titleField.text = [dic valueForKey:@"Description"];
    cell.urlField.text = [dic valueForKey:@"Url"];
    
    return cell;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.references count];
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    self.selectedReference= [self.references objectAtIndex:indexPath.row];
    [self performSegueWithIdentifier:@"referenceDetail" sender:self];
}

@end